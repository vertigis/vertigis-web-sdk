// @ts-check
"use strict";

import { existsSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

import paths from "@vertigis/sdk-library/config/paths.js";
import sdkStart from "@vertigis/sdk-library/scripts/start.js";

// These needs to be set prior to importing the webpack config. The only way to
// do that with ES modules is by using a dynamic import.
process.env.BABEL_ENV = "development";
process.env.NODE_ENV = "development";

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

sdkStart(webpackConfig, "web");
