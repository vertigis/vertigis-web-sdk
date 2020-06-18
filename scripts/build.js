// @ts-check
"use strict";

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = "production";
process.env.NODE_ENV = "production";

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on("unhandledRejection", (err) => {
    throw err;
});

const chalk = require("chalk");
const webpack = require("webpack");

const webpackConfig = require("../config/webpack.config");

const build = () => {
    console.log("Creating an optimized production build...");

    const compiler = webpack(webpackConfig);
    return new Promise((resolve, reject) => {
        compiler.run((err, stats) => {
            if (err) {
                return reject(err);
            }

            console.log(stats.toString("minimal"));

            if (stats.hasErrors()) {
                return reject();
            }

            if (
                process.env.CI &&
                (typeof process.env.CI !== "string" ||
                    process.env.CI.toLowerCase() !== "false") &&
                stats.hasWarnings()
            ) {
                console.log(
                    chalk.yellow(
                        "\nTreating warnings as errors because process.env.CI = true.\n" +
                            "Most CI servers set it automatically.\n"
                    )
                );
                return reject();
            }

            if (stats.hasWarnings()) {
                console.log(chalk.yellow("Compiled with warnings.\n"));
            } else {
                console.log(chalk.green("Compiled successfully.\n"));
                console.log(
                    `Your production build was created inside the ${chalk.cyan(
                        "build"
                    )} folder.`
                );
                console.log(
                    `You can learn more about deploying your custom code at ${chalk.cyan(
                        "https://developers.geocortex.com/docs/web/overview/"
                    )}`
                );
            }

            resolve();
        });
    });
};

(async () => {
    try {
        await build();
    } catch (e) {
        if (e && e.message) {
            console.error(e.message);
        }
        process.exit(1);
    }
})();
