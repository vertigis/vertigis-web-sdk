// @ts-check
import chalk, { supportsColor } from "chalk";
import { access, accessSync } from "fs";
import webpack from "webpack";
import * as path from "path";
import { pathToFileURL } from "url";

import paths from "../config/paths.js";

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on("unhandledRejection", err => {
    throw err;
});

// These needs to be set prior to importing the webpack config. The only way to
// do that with ES modules is by using a dynamic import.
process.env.BABEL_ENV = "production";
process.env.NODE_ENV = "production";

// Load the webpack.config.js from the project folder if it exists.
let webpackConfigUrl;
try {
    const localWebPackPath = path.join(paths.projRoot, "webpack.config.js");
    accessSync(localWebPackPath);
    webpackConfigUrl = pathToFileURL(localWebPackPath).href;
} catch (e) {
    webpackConfigUrl = "../config/webpack.config.js";
}
const { default: webpackConfig } = await import(webpackConfigUrl);

const build = () => {
    console.log("Creating an optimized production build...\n");

    const compiler = webpack(webpackConfig);
    /**
     * @type { Promise<void> }
     */
    const promise = new Promise((resolve, reject) => {
        compiler.run((err, stats) => {
            if (err) {
                return reject(err);
            }

            console.log(
                stats?.toString({
                    preset: "normal",
                    colors: supportsColor ? supportsColor.hasBasic : false,
                })
            );

            if (stats?.hasErrors()) {
                return reject();
            }

            if (
                process.env.CI &&
                (typeof process.env.CI !== "string" || process.env.CI.toLowerCase() !== "false") &&
                stats?.hasWarnings()
            ) {
                console.log(
                    chalk.yellow(
                        "\nTreating warnings as errors because process.env.CI = true.\n" +
                            "Most CI servers set it automatically.\n"
                    )
                );
                return reject();
            }

            if (stats?.hasWarnings()) {
                console.log(chalk.yellow("\nCompiled with warnings.\n"));
            } else {
                console.log(chalk.green("\nCompiled successfully.\n"));
                console.log(
                    `Your production build was created inside the ${chalk.cyan("build")} folder.`
                );
                console.log(
                    `You can learn more about deploying your custom code at ${chalk.cyan(
                        "https://developers.vertigisstudio.com/docs/web/overview/"
                    )}`
                );
            }

            resolve();
        });
    });
    return promise;
};

try {
    await build();
} catch (e) {
    if (e instanceof Error && e.message) {
        console.error(e);
    }
    process.exit(1);
}
