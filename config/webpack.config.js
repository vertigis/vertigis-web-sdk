// @ts-check
"use strict";

const path = require("path");
const paths = require("./paths");
const webpack = require("webpack");

const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const isProdMode = process.env.NODE_ENV === "production";

module.exports = {
    mode: isProdMode ? "production" : "development",
    context: paths.projPath,
    devtool: isProdMode ? false : "eval",
    resolve: {
        extensions: paths.moduleFileExtensions,
    },
    entry: paths.projIndexJs,
    externals: [/^esri\/.+$/, /^@geocortex\/.+$/],
    output: {
        libraryTarget: "amd",
        publicPath: ".",
    },
    optimization: {
        minimize: isProdMode,
        // This is only used in production mode
        minimizer: [
            // Minify JS output
            new TerserPlugin({
                cache: true,
                parallel: true,
            }),
        ],
        // Automatically split vendor and commons
        // https://twitter.com/wSokra/status/969633336732905474
        // https://medium.com/webpack/webpack-4-code-splitting-chunk-graph-and-the-splitchunks-optimization-be739a861366
        splitChunks: {
            chunks: "all",
        },
        // Keep the runtime chunk separated to enable long term caching
        // https://twitter.com/wSokra/status/969679223278505985
        // runtimeChunk: true,
    },
    module: {
        strictExportPresence: true,
        rules: [
            // "url" loader works just like "file" loader but it also embeds
            // assets smaller than specified size as data URLs to avoid requests.
            {
                test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                loader: "url-loader",
                options: {
                    limit: 10000,
                    name: "static/media/[name].[hash:8].[ext]",
                },
            },
        ],
    },
    plugins: [
        isProdMode && new CleanWebpackPlugin(),

        // Define process.env variables that should be made available in source code.
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": process.env.NODE_ENV,
        }),

        // Generates an `index.html` file with the <script> injected.
        new HtmlWebPackPlugin({
            template: path.resolve(paths.ownPath, "lib", "index.html"),
        }),
    ].filter(Boolean),
    node: {
        dgram: "empty",
        fs: "empty",
        net: "empty",
        tls: "empty",
        child_process: "empty",
    },
};
