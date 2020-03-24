// @ts-check
"use strict";

const chalk = require("chalk");
const spawn = require("cross-spawn");
const fs = require("fs-extra");
const path = require("path");

const directoryName = process.argv[2];
const directoryPath = path.resolve(directoryName);

// TODO: Change project name in package.json after copy

const copyTemplate = rootPath => {
    console.log(`Creating new project at ${chalk.green(rootPath)}`);
    fs.copySync(path.join(__dirname, "../template"), rootPath, {
        errorOnExist: true,
        overwrite: false,
    });
};

const installDeps = rootPath => {
    console.log(`Installing packages. This might take a couple minutes.`);
    const result = spawn.sync(
        "npm",
        ["install", "--save", process.env.SDK_SOURCE || "@vertigis/web-sdk"],
        {
            cwd: rootPath,
            stdio: "inherit",
        }
    );

    if (result.status !== 0) {
        process.exit(1);
    }
};

// Initialize newly cloned directory as a git repo
const gitInit = rootPath => {
    console.log(`Initialising git in ${rootPath}`);

    spawn.sync(`git init`, { cwd: rootPath }).status;
};

const printSuccess = () => {
    console.log(`Success! Created ${directoryName} at ${directoryPath}`);
    console.log("Inside that directory, you can run several commands:\n");
    console.log(chalk.cyan(`  npm start`));
    console.log("    Starts the development server.\n");
    console.log(chalk.cyan(`  npm run build`));
    console.log("    Bundles the app into static files for production.\n");
    console.log("We suggest that you begin by typing:\n");
    console.log(chalk.cyan(`  cd ${directoryName}`));
    console.log(chalk.cyan("  npm start"));
};

copyTemplate(directoryPath);
installDeps(directoryPath);
gitInit(directoryPath);
printSuccess();
