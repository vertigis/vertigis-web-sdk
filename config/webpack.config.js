import * as path from "path";

import paths from "@vertigis/sdk-library/config/paths.js";
import baseConfig from "@vertigis/sdk-library/config/webpack.base.config.js";
import HtmlWebPackPlugin from "html-webpack-plugin";
import { merge } from "webpack-merge";

const isEnvDevelopment = process.env.NODE_ENV === "development";
const isEnvProduction = process.env.NODE_ENV === "production";

/*
 * Add customizations for Web SDK libraries to the base config.
 */
export default merge(baseConfig, {
    resolve: {
        alias: {
            esri: "@arcgis/core",
        },
    },
    externals: [
        /^@arcgis\/.+$/,
        /^esri\/.+$/,
        /^@vertigis\/arcgis-extensions\/.+$/,
        /^@vertigis\/viewer-spec\/.+$/,
        /^@vertigis\/web\/.+$/,
        /^@vertigis\/workflow\/.+$/,
        "react",
        "react-dom",
    ],
    output: {
        // Use "/" in dev so hot updates are requested from server root instead
        // of from "viewer" relative path.
        publicPath: isEnvProduction ? "." : "/",
    },
    plugins: [
        // Generates an `index.html` file with the <script> injected.
        isEnvDevelopment &&
            new HtmlWebPackPlugin({
                inject: false,
                template: path.resolve(paths.ownPath, "../web-sdk/lib", "index.ejs"),
                additionalLibs: process.env.ADDITIONAL_LIBS,
            }),
    ].filter(Boolean),
});
