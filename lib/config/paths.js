// @ts-check
"use strict";

const fs = require("fs");
const path = require("path");

const moduleFileExtensions = [".mjs", ".js", ".ts", ".tsx", ".json", ".jsx"];

// Resolve file paths in the same order as webpack
const resolveModule = (resolveFn, filePath) => {
    const extension = moduleFileExtensions.find(extension =>
        fs.existsSync(resolveFn(`${filePath}${extension}`))
    );

    if (extension) {
        return resolveFn(`${filePath}${extension}`);
    }

    return resolveFn(`${filePath}.js`);
};
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
// Up 2 from "lib/config/"
const resolveOwn = relativePath => path.resolve(__dirname, "..", "..", relativePath);

module.exports = {
    projIndexJs: resolveModule(resolveApp, "src/index"),
    projPath: resolveApp("."),
    projPublicDir: resolveApp("public"),
    projSrc: resolveApp("src"),
    ownPath: resolveOwn("."),
};

module.exports.moduleFileExtensions = moduleFileExtensions;
