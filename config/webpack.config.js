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
    externals: [/^esri\/.+$/, /^@geocortex\/.+$/, "react", "react-dom"],
    output: {
        library: "@custom",
        libraryTarget: "amd",
        publicPath: ".",
        jsonpFunction: "sdk",
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
            {
                // "oneOf" will traverse all following loaders until one will
                // match the requirements. When no loader matches it will fall
                // back to the "file" loader at the end of the loader list.
                oneOf: [
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
                    // Process application JS with Babel.
                    // The preset includes JSX, Flow, TypeScript, and some ESnext features.
                    {
                        test: /\.(js|mjs|jsx|ts|tsx)$/,
                        include: paths.appSrc,
                        loader: require.resolve("babel-loader"),
                        options: {
                            babelrc: false,
                            configFile: require.resolve("./babel.config.js"),
                            // This is a feature of `babel-loader` for webpack (not Babel itself).
                            // It enables caching results in ./node_modules/.cache/babel-loader/
                            // directory for faster rebuilds.
                            cacheDirectory: true,
                            cacheCompression: isProdMode,
                        },
                    },
                    // "file" loader makes sure those assets get served by WebpackDevServer.
                    // When you `import` an asset, you get its (virtual) filename.
                    // In production, they would get copied to the `build` folder.
                    // This loader doesn't use a "test" so it will catch all modules
                    // that fall through the other loaders.
                    // {
                    //     loader: require.resolve("file-loader"),
                    //     // Exclude `js` files to keep "css" loader working as it injects
                    //     // its runtime that would otherwise be processed through "file" loader.
                    //     // Also exclude `html` and `json` extensions so they get processed
                    //     // by webpacks internal loaders.
                    //     exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
                    //     options: {
                    //         name: "static/media/[name].[hash:8].[ext]",
                    //     },
                    // },
                    // ** STOP ** Are you adding a new loader?
                    // Make sure to add the new loader(s) before the "file" loader.
                ],
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
            inject: false,
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
