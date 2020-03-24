/* eslint-disable @typescript-eslint/no-var-requires */
// @ts-check
"use strict";

const fs = require("fs");
const path = require("path");

const moduleFileExtensions = [".tsx", ".ts", ".jsx", ".js", ".json"];

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
const appDirectory = fs.realpathSync(
    (process.env.SDK_SOURCE && path.join(process.env.SDK_SOURCE, "template")) || process.cwd()
);
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
// Up 1 from "config/"
const resolveOwn = relativePath => path.resolve(__dirname, "..", relativePath);

module.exports = {
    projBuild: resolveApp("build"),
    projEntry: resolveModule(resolveApp, "src/index"),
    projPath: resolveApp("."),
    projPublicDir: resolveApp("public"),
    projSrc: resolveApp("src"),
    ownPath: resolveOwn("."),
};

module.exports.moduleFileExtensions = moduleFileExtensions;
