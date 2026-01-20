// @ts-check
"use strict";

import { existsSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

import paths from "@vertigis/sdk-library/config/paths.js";
import sdkBuild from "@vertigis/sdk-library/scripts/build.js";

// These needs to be set prior to importing the webpack config. The only way to
// do that with ES modules is by using a dynamic import.
process.env.BABEL_ENV = "production";
process.env.NODE_ENV = "production";

// Load the webpack.config.js from the project folder if it exists.
const localWebPackPath = path.join(paths.projRoot, "webpack.config.js");
const webpackConfigUrl = existsSync(localWebPackPath)
    ? pathToFileURL(localWebPackPath).href
    : "../config/webpack.config.js";

const { default: webpackConfig } = await import(webpackConfigUrl);

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on("unhandledRejection", err => {
    throw err;
});

try {
    await sdkBuild(webpackConfig, "web");
} catch (e) {
    if (e instanceof Error && e.message) {
        console.error(e);
    }
    process.exit(1);
}
