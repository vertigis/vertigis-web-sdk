// @ts-check
"use strict";

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = "development";
process.env.NODE_ENV = "development";

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on("unhandledRejection", err => {
    throw err;
});

const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const webpackConfig = require("../config/webpack.config");

const compiler = webpack(webpackConfig);
const serverConfig = {
    clientLogLevel: "silent",
    compress: true,
    // contentBase: paths.publicDir,
    disableHostCheck: true,
    headers: {
        "Access-Control-Allow-Origin": "*",
    },
    // Allow binding to any host (localhost, jdoe-pc.latitudegeo.com, etc).
    host: "0.0.0.0",
    // hot: true,
    open: true,
    port: 3000,
    proxy: {
        "/viewer": "http://webzoo.latitudegeo.com/webviewer",
    },
    // publicPath: "/",
    stats: "minimal",
    // watchContentBase: true,
};

const devServer = new WebpackDevServer(compiler, serverConfig);
devServer.listen(serverConfig.port, serverConfig.host, err => {
    if (err) {
        throw err;
    }
});
