// @ts-check
import chalk, { supportsColor } from "chalk";
import webpack from "webpack";

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
const { default: webpackConfig } = await import("../config/webpack.config.js");
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
                        "https://developers.geocortex.com/docs/web/overview/"
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
