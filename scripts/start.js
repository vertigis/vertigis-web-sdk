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
const open = require("open");
const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const paths = require("../config/paths");
const webpackConfig = require("../config/webpack.config");

const httpAgent = new http.Agent({ keepAlive: true });
const httpsAgent = new https.Agent({ keepAlive: true });

const viewerTarget =
    process.env.VIEWER_URL || "https://apps.geocortex.com/webviewer";
const port = process.env.PORT || 3000;

const compiler = webpack(webpackConfig);
const serverConfig = {
    after: function () {
        if (process.env.OPEN_BROWSER !== "false") {
            open(`http://localhost:${port}`);
        }
    },
    clientLogLevel: "silent",
    compress: true,
    contentBase: paths.projPublicDir,
    disableHostCheck: true,
    headers: {
        "Access-Control-Allow-Origin": "*",
    },
    // Allow binding to any host (localhost, jdoe-pc.latitudegeo.com, etc).
    host: "0.0.0.0",
    hot: true,
    port,
    proxy: {
        "/viewer": {
            target: viewerTarget,
            agent: viewerTarget.startsWith("https") ? httpsAgent : httpAgent,
            changeOrigin: true,
            logLevel: "warn",
            pathRewrite: {
                // Strip /viewer from path so it isn't forwarded to the target
                // /viewer/index.html => /index.html => https://apps.geocortex.com/webviewer/index.html
                "^/viewer": "",
            },
        },
    },
    sockPort: process.env.SOCK_PORT || undefined,
    stats: "minimal",
    watchContentBase: true,
    watchOptions: {
        // Don't bother watching node_modules files for changes. This reduces
        // CPU/mem overhead, but means that changes from `npm install` while the
        // dev server is running won't take effect until restarted.
        ignored: /node_modules/,
    },
};

const devServer = new WebpackDevServer(compiler, serverConfig);
devServer.listen(serverConfig.port, serverConfig.host, (err) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
});

["SIGINT", "SIGTERM"].forEach((signal) => {
    process.on(signal, () => {
        devServer.close(() => {
            process.exit();
        });
    });
});
