// @ts-check
"use strict";

import * as crypto from "crypto";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

import chalk from "chalk";
import * as spawn from "cross-spawn";
import fsExtra from "fs-extra";

const { copySync, moveSync } = fsExtra;
const dirName = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(dirName, "..");
const createIndex = process.argv.findIndex(s => s.includes("create"));
const directoryName = process.argv[createIndex + 1];
const directoryPath = path.resolve(directoryName);

/**
 * @param {import("child_process").SpawnSyncReturns<Buffer>} syncResult
 */
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

    // Not keeping these files in the template directory allows the template
    // code to be checked from within this project.
    copySync(
        path.join(rootDir, "config/tsconfig.json.template"),
        path.join(projectPath, "tsconfig.json"),
        {
            errorOnExist: true,
            overwrite: false,
        }
    );
    copySync(
        path.join(rootDir, "config/eslint.config.js.template"),
        path.join(projectPath, "eslint.config.js"),
        {
            errorOnExist: true,
            overwrite: false,
        }
    );
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

/**
 * @param {string} projectPath
 */
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

    // First install existing deps.
    checkSpawnSyncResult(
        spawn.sync("npm", ["install"], {
            cwd: projectPath,
            stdio: "inherit",
        })
    );

    // Copy a freshly packaged instance of this repo to install from if this
    // is a local dev copy. This is done because eslint no longer plays nice
    // with linked repos.
    if (process.env.SDK_LOCAL_DEV === "true") {
        fs.copyFileSync(
            path.join(rootDir, "vertigis-web-sdk-0.0.0-semantically-released.tgz"),
            path.join(projectPath, "vertigis-web-sdk.tgz")
        );
        fs.unlinkSync(path.join(rootDir, "vertigis-web-sdk-0.0.0-semantically-released.tgz"));
    }

    // Add SDK and Web runtime packages.
    checkSpawnSyncResult(
        spawn.sync(
            "npm",
            [
                "install",
                "--save-dev",
                "--save-exact",
                process.env.SDK_LOCAL_DEV === "true"
                    ? path.join(projectPath, "./vertigis-web-sdk.tgz")
                    : `@vertigis/web-sdk@${selfVersion}`,
                "@vertigis/web",
            ],
            {
                cwd: projectPath,
                stdio: "inherit",
            }
        )
    );
};

/**
 * Initialize newly cloned directory as a git repo.
 *
 * @param {string} projectPath
 */
const gitInit = projectPath => {
    console.log(`Initializing git in ${projectPath}\n`);
    spawn.sync(`git init -b main`, { cwd: projectPath }).status;
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
        "You can learn more by visiting https://developers.vertigisstudio.com/docs/web/sdk-overview/"
    );
};

copyTemplate(directoryPath);
updateTemplateContent(directoryPath);
installNpmDeps(directoryPath);
gitInit(directoryPath);
printSuccess();
