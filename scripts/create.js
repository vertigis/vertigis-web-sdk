// @ts-check
"use strict";

import chalk from "chalk";
import * as crypto from "crypto";
import * as spawn from "cross-spawn";
import * as fs from "fs";
import fsExtra from "fs-extra";
import * as path from "path";
import { fileURLToPath } from "url";

const { copySync, moveSync } = fsExtra;
const dirName = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(dirName, "..");
const createIndex = process.argv.findIndex(s => s.includes("create"));
const directoryName = process.argv[createIndex + 1];
const directoryPath = path.resolve(directoryName);

const checkSpawnSyncResult = syncResult => {
    if (syncResult.status !== 0) {
        process.exit(1);
    }
};

/**
 * @param {string} projectPath
 */
const copyTemplate = projectPath => {
    if (fs.existsSync(projectPath) && fs.readdirSync(projectPath).length > 0) {
        console.error(
            chalk.red(
                `Cannot create new project at ${chalk.green(projectPath)} as it already exists.\n`
            )
        );
        process.exit(1);
    }

    console.log(`Creating new project at ${chalk.green(projectPath)}`);

    copySync(path.join(rootDir, "template"), projectPath, {
        errorOnExist: true,
        overwrite: false,
    });
    // Rename gitignore after the fact to prevent npm from renaming it to .npmignore
    // See: https://github.com/npm/npm/issues/1862
    moveSync(path.join(projectPath, "gitignore"), path.join(projectPath, ".gitignore"));
};

/**
 * @param {string} projectPath
 */
const updateTemplateContent = projectPath => {
    const randomNamespace = `custom.${crypto.randomBytes(4).toString("hex")}`;

    const filesToUpdate = [
        path.join(projectPath, "app/layout.xml"),
        path.join(projectPath, "src/index.ts"),
    ];

    for (const fileToUpdate of filesToUpdate) {
        const contents = fs.readFileSync(fileToUpdate, { encoding: "utf8" });
        const newContents = contents.replace(/custom\.foo/g, randomNamespace);
        fs.writeFileSync(fileToUpdate, newContents);
    }
};

const installNpmDeps = projectPath => {
    console.log(`Installing packages. This might take a couple minutes.\n`);
    /**
     * @type {string}
     */
    const selfVersion = JSON.parse(
        fs.readFileSync(path.join(rootDir, "package.json"), {
            encoding: "utf-8",
        })
    ).version;

    // One of this project's dependencies (semantic-release) has "npm" as a
    // dependency. This puts a specific version of the npm binaries in the
    // node_modules/.bin folder. Unfortunately, this means that running "npm"
    // below will pick up this version instead of whatever is installed on the
    // user's machine. This can have unintended side-effects, such as generating
    // a lock file with the wrong version. Temporarily rename the whole folder
    // to avoid this.
    fs.renameSync(
        path.join(rootDir, "node_modules", ".bin"),
        path.join(rootDir, "node_modules", ".bin.ignore")
    );

    try {
        // First install existing deps.
        checkSpawnSyncResult(
            spawn.sync("npm", ["install"], {
                cwd: projectPath,
                stdio: "inherit",
            })
        );

        // Add SDK and Web runtime packages.
        checkSpawnSyncResult(
            spawn.sync(
                "npm",
                [
                    "install",
                    "--save-dev",
                    "--save-exact",
                    process.env.SDK_LOCAL_DEV === "true"
                        ? process.cwd()
                        : `@vertigis/web-sdk@${selfVersion}`,
                    "@vertigis/web",
                ],
                {
                    cwd: projectPath,
                    stdio: "inherit",
                }
            )
        );
    } finally {
        fs.renameSync(
            path.join(rootDir, "node_modules", ".bin.ignore"),
            path.join(rootDir, "node_modules", ".bin")
        );
    }
};

/**
 * Initialize newly cloned directory as a git repo.
 *
 * @param {string} projectPath
 */
const gitInit = projectPath => {
    console.log(`Initializing git in ${projectPath}\n`);

    spawn.sync(`git init`, { cwd: projectPath }).status;
};

const printSuccess = () => {
    console.log(`${chalk.green("Success!")} Created ${directoryName} at ${directoryPath}\n`);
    console.log("Inside that directory, you can run several commands:\n");
    console.log(chalk.cyan(`  npm start`));
    console.log("    Starts the development server.\n");
    console.log(chalk.cyan(`  npm run build`));
    console.log("    Bundles the app into static files for production.\n");
    console.log("We suggest that you begin by typing:\n");
    console.log(chalk.cyan(`  cd ${directoryName}`));
    console.log(chalk.cyan("  npm start\n"));
    console.log(
        "You can learn more by visiting https://developers.geocortex.com/docs/web/sdk-overview/"
    );
};

copyTemplate(directoryPath);
updateTemplateContent(directoryPath);
installNpmDeps(directoryPath);
gitInit(directoryPath);
printSuccess();
