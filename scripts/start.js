// @ts-check
"use strict";

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = "development";
process.env.NODE_ENV = "development";

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on("unhandledRejection", (err) => {
    throw err;
});

const http = require("http");
const https = require("https");
const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const paths = require("../config/paths");
const webpackConfig = require("../config/webpack.config");

const httpAgent = new http.Agent({ keepAlive: true });
const httpsAgent = new https.Agent({ keepAlive: true });

const viewerTarget =
    process.env.VIEWER_URL || "https://apps.vertigisstudio.com/web";
const port = process.env.PORT || 3000;

const compiler = webpack(webpackConfig);
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
    proxy: {
        "/viewer": {
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
    },
    static: {
        directory: paths.projPublicDir,
    },
};

const devServer = new WebpackDevServer(serverConfig, compiler);
devServer.start();
