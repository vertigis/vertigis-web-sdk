// @ts-check
"use strict";

const fs = require("fs");
const path = require("path");

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
const resolveOwn = relativePath => path.resolve(__dirname, "..", relativePath);

module.exports = {
    projPath: resolveApp("."),
    projSrc: resolveApp("src"),
    ownPath: resolveOwn("."),
};
