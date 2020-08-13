/* eslint-disable @typescript-eslint/no-var-requires */
// @ts-check
"use strict";

const path = require("path");
const paths = require("./paths");
const webpack = require("webpack");

const autoprefixer = require("autoprefixer");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const isEnvDevelopment = process.env.NODE_ENV === "development";
const isEnvProduction = process.env.NODE_ENV === "production";

// Generate random identifier to ensure uniqueness in the application. This is
// especially important to avoid collisions when multiple webpack runtimes are
// in the same document, such as Web's runtime and this library's runtime.
const libId = require("crypto").randomBytes(8).toString("hex");

module.exports = {
    mode: isEnvProduction ? "production" : "development",
    context: paths.projRoot,
    devtool: isEnvProduction ? false : "eval",
    // Disable perf hints as it's mostly out of the developer's control as we
    // only allow one chunk.
    performance: false,
    stats: "minimal",
    resolve: {
        extensions: paths.moduleFileExtensions,
    },
    entry: paths.projEntry,
    externals: [
        /^dojo\/.+$/,
        /^esri\/.+$/,
        /^@vertigis\/.+$/,
        "react",
        "react-dom",
    ],
    output: {
        // Technically this shouldn't be needed as we restrict the library to
        // one chunk, but we set this here just to be extra safe against
        // collisions.
        jsonpFunction: libId,
        libraryTarget: "amd",
        // Use "/" in dev so hot updates are requested from server root instead
        // of from "viewer" relative path.
        publicPath: isEnvProduction ? "." : "/",
        path: isEnvProduction ? paths.projBuild : undefined,
        // TODO: remove this when upgrading to webpack 5
        futureEmitAssets: true,
        // There will be one main bundle, and one file per asynchronous chunk.
        // In development, it does not produce real files.
        filename: "[name].js",
    },
    optimization: {
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
                    // Embeds assets smaller than the specified limit (Infinity
                    // in our case) as data URLs.
                    {
                        test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
                        loader: require.resolve("url-loader"),
                        options: {
                            esModule: true,
                        },
                    },
                    // Process application JS with Babel.
                    // The preset includes JSX, Flow, TypeScript, and some ESnext features.
                    {
                        test: /\.(js|jsx|ts|tsx)$/i,
                        include: paths.projSrc,
                        loader: require.resolve("ts-loader"),
                        options: {
                            context: paths.projRoot,
                            transpileOnly: true,
                        },
                    },
                    {
                        test: /\.css$/i,
                        sideEffects: true,
                        use: [
                            {
                                loader: require.resolve("style-loader"),
                                options: {
                                    esModule: true,
                                },
                            },
                            {
                                loader: require.resolve("css-loader"),
                                options: {
                                    // How many loaders before "css-loader" should be applied to "@import"ed resources
                                    importLoaders: 1,
                                },
                            },
                            {
                                // Adds vendor prefixing based on your specified browser support in
                                // package.json
                                loader: require.resolve("postcss-loader"),
                                options: {
                                    ident: "postcss",
                                    plugins: () =>
                                        [
                                            autoprefixer({
                                                flexbox: "no-2009",
                                                overrideBrowserslist: [
                                                    "last 2 chrome versions",
                                                    "last 2 firefox versions",
                                                    "last 2 safari versions",
                                                ],
                                            }),
                                            isEnvProduction &&
                                                require("cssnano")(),
                                        ].filter(Boolean),
                                },
                            },
                        ],
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
            }),

        new ForkTsCheckerWebpackPlugin({
            eslint: {
                enabled: true,
                files: "./src/**/*.{js,jsx,ts,tsx}",
                options: {
                    resolvePluginsRelativeTo: __dirname,
                },
            },
            formatter: "codeframe",
        }),

        // Define process.env variables that should be made available in source code.
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
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
