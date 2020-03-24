/* eslint-disable @typescript-eslint/no-var-requires */
// @ts-check
"use strict";

const path = require("path");
const paths = require("./paths");
const webpack = require("webpack");

const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const isEnvDevelopment = process.env.NODE_ENV === "development";
const isEnvProduction = process.env.NODE_ENV === "production";
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
    externals: [
        /^dojo\/.+$/,
        /^esri\/.+$/,
        /^@geocortex\/.+$/,
        /^@vertigis\/.+$/,
        "react",
        "react-dom",
    ],
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
                    // Process application JS with Babel.
                    // The preset includes JSX, Flow, TypeScript, and some ESnext features.
                    {
                        test: /\.(js|jsx|ts|tsx)$/,
                        include: paths.projSrc,
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

        new ForkTsCheckerWebpackPlugin({
            async: isEnvProduction ? false : true,
            eslint: true,
            eslintOptions: {
                cache: true,
                resolvePluginsRelativeTo: __dirname,
            },
            formatter: "codeframe",
        }),

        // Define process.env variables that should be made available in source code.
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": process.env.NODE_ENV,
        }),

        new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),

        isEnvProduction && new CleanWebpackPlugin(),
    ].filter(Boolean),
    node: {
        dgram: "empty",
        fs: "empty",
        net: "empty",
        tls: "empty",
        // eslint-disable-next-line @typescript-eslint/camelcase
        child_process: "empty",
    },
};
