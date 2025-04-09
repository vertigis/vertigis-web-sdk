// @ts-check
"use strict";

import paths from "@vertigis/sdk-library/config/paths.js";
import * as http from "http";
import * as https from "https";
import path from "path";
import { existsSync } from "fs";
import { pathToFileURL } from "url";
import webpack from "webpack";
import WebpackDevServer from "webpack-dev-server";

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on("unhandledRejection", err => {
    throw err;
});

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

const httpAgent = new http.Agent({ keepAlive: true });
const httpsAgent = new https.Agent({ keepAlive: true });

const viewerTarget = process.env.VIEWER_URL || "https://apps.vertigisstudio.com/web";
const port = process.env.PORT || 3001;

const compiler = webpack(webpackConfig);
/**
 * @type { WebpackDevServer.Configuration }
 */
const serverConfig = {
    allowedHosts: "all",
    client: {
        logging: "none",
        webSocketURL: {
            port: process.env.SOCK_PORT || undefined,
        },
    },
    compress: true,
    headers: {
        "Access-Control-Allow-Origin": "*",
    },
    // Allow binding to any host (localhost, jdoe-pc.latitudegeo.com, etc).
    host: "0.0.0.0",
    hot: true,
    open:
        process.env.OPEN_BROWSER !== "false" &&
        `http://localhost:${port}${process.env.OPEN_PAGE || ""}`,
    port,
    proxy: [
        {
            path: "/viewer",
            target: viewerTarget,
            agent: viewerTarget.startsWith("https") ? httpsAgent : httpAgent,
            changeOrigin: true,
            logLevel: "warn",
            pathRewrite: {
                // Strip /viewer from path so it isn't forwarded to the target
                // /viewer/index.html => /index.html => https://apps.vertigisstudio.com/web/index.html
                "^/viewer": "",
            },
        },
    ],
    static: {
        directory: paths.projPublicDir,
    },
};

const devServer = new WebpackDevServer(serverConfig, compiler);
await devServer.start();
