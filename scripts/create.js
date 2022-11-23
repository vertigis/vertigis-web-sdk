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
 * @param {string} rootPath
 */
const copyTemplate = rootPath => {
    if (fs.existsSync(rootPath) && fs.readdirSync(rootPath).length > 0) {
        console.error(
            chalk.red(
                `Cannot create new project at ${chalk.green(rootPath)} as it already exists.\n`
            )
        );
        process.exit(1);
    }

    console.log(`Creating new project at ${chalk.green(rootPath)}`);

    copySync(path.join(rootDir, "template"), rootPath, {
        errorOnExist: true,
        overwrite: false,
    });
    // Rename gitignore after the fact to prevent npm from renaming it to .npmignore
    // See: https://github.com/npm/npm/issues/1862
    moveSync(path.join(rootPath, "gitignore"), path.join(rootPath, ".gitignore"));
};

/**
 * @param {string} rootPath
 */
const updateTemplateContent = rootPath => {
    const randomNamespace = `custom.${crypto.randomBytes(4).toString("hex")}`;

    const filesToUpdate = [
        path.join(rootPath, "app/layout.xml"),
        path.join(rootPath, "src/index.ts"),
    ];

    for (const fileToUpdate of filesToUpdate) {
        const contents = fs.readFileSync(fileToUpdate, { encoding: "utf8" });
        const newContents = contents.replace(/custom\.foo/g, randomNamespace);
        fs.writeFileSync(fileToUpdate, newContents);
    }
};

const installNpmDeps = rootPath => {
    console.log(`Installing packages. This might take a couple minutes.\n`);
    /**
     * @type {string}
     */
    const selfVersion = JSON.parse(
        fs.readFileSync(path.join(rootDir, "package.json"), {
            encoding: "utf-8",
        })
    ).version;

    // First install existing deps.
    checkSpawnSyncResult(
        spawn.sync("npm", ["install"], {
            cwd: rootPath,
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
                cwd: rootPath,
                stdio: "inherit",
            }
        )
    );
};

/**
 * Initialize newly cloned directory as a git repo.
 *
 * @param {string} rootPath
 */
const gitInit = rootPath => {
    console.log(`Initializing git in ${rootPath}\n`);

    spawn.sync(`git init`, { cwd: rootPath }).status;
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
