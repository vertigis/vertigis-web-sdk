// @ts-check
"use strict";

const path = require("path");
const paths = require("./paths");
const webpack = require("webpack");

const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const isEnvProduction = process.env.NODE_ENV === "production";
const isEnvDevelopment = process.env.NODE_ENV === "development";
const libraryName = require(path.join(paths.projPath, "package.json")).name || "custom-library";

// TODO: Enforce single bundle - to load via portal we need a singular request as they don't support .js,
// etc. file extensions.
// - No code splitting
// - CSS should be embedded

module.exports = {
    mode: isEnvProduction ? "production" : "development",
    context: paths.projPath,
    devtool: isEnvProduction ? false : "eval",
    stats: "minimal",
    resolve: {
        extensions: paths.moduleFileExtensions,
    },
    entry: paths.projEntry,
    externals: [/^dojo\/.+$/, /^esri\/.+$/, /^@geocortex\/.+$/, "react", "react-dom"],
    output: {
        // `library` will be automatically concatenated with `output.jsonpFunction`s value.
        // It's important to have a unique `jsonpFunction` value to allow multiple webpack
        // runtimes on the same page.
        // library: libraryName,
        libraryTarget: "amd",
        // Use "/" in dev so hot updates are requested from server root instead
        // of from "viewer" relative path.
        publicPath: isEnvProduction ? "." : "/",
        path: isEnvProduction ? paths.projBuild : undefined,
        // TODO: remove this when upgrading to webpack 5
        futureEmitAssets: true,
        // There will be one main bundle, and one file per asynchronous chunk.
        // In development, it does not produce real files.
        filename: isEnvProduction ? "static/js/[name].[contenthash:8].js" : "static/js/[name].js",
        // There are also additional JS chunk files if you use code splitting.
        chunkFilename: isEnvProduction
            ? "static/js/[name].[contenthash:8].chunk.js"
            : "static/js/[name].chunk.js",
    },
    optimization: {
        minimize: isEnvProduction,
        // This is only used in production mode
        minimizer: [
            // Minify JS output
            new TerserPlugin(),
        ],
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
                            cacheCompression: isEnvProduction,
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
        // Generates an `index.html` file with the <script> injected.
        isEnvDevelopment &&
            new HtmlWebPackPlugin({
                inject: false,
                template: path.resolve(paths.ownPath, "lib", "index.ejs"),
                libraryName,
            }),

        // Define process.env variables that should be made available in source code.
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": process.env.NODE_ENV,
        }),

        isEnvProduction && new CleanWebpackPlugin(),
    ].filter(Boolean),
    node: {
        dgram: "empty",
        fs: "empty",
        net: "empty",
        tls: "empty",
        child_process: "empty",
    },
};
