//@ts-check
"use strict";

// This script will update the custom library to target the latest version of
// VertiGIS Studio Web and the Web SDK.

import fetch from "node-fetch";
import * as fs from "fs";
import * as path from "path";
import * as spawn from "cross-spawn";
import { fileURLToPath } from "url";

const dirName = path.dirname(fileURLToPath(import.meta.url));
const ownPath = path.resolve(dirName, "..");

console.info("Determining latest versions of Web and Web SDK...");
let responses = await Promise.all([
    fetch("https://registry.npmjs.com/@vertigis/web/"),
    fetch("https://registry.npmjs.com/@vertigis/web-sdk/"),
]);
const [webInfo, sdkInfo] = await Promise.all(responses.map(r => r.json()));
/**
 * @type {string}
 */
const latestWeb = webInfo["dist-tags"]?.latest;
if (!latestWeb) {
    throw new Error("Unable to determine the latest version VertiGIS Studio Web.");
}
/**
 * @type {string}
 */
const latestSDK = sdkInfo["dist-tags"]?.latest;
if (!latestSDK) {
    throw new Error("Unable to determine the latest version VertiGIS Studio Web SDK.");
}

const projectPackage = JSON.parse(await fs.promises.readFile("package.json", "utf8"));

// Update Web and SDK to latest versions.
projectPackage.devDependencies["@vertigis/web"] = `^${latestWeb}`;
projectPackage.devDependencies["@vertigis/web-sdk"] = `^${latestSDK}`;

// Check for old eslint configuration and fix it.
if (fs.existsSync(".eslintrc.js") && !fs.existsSync("eslint.config.js")) {
    console.info("Adding new default configuration for eslint to 'eslint.config.js'.");
    console.info(
        "If you have existing '.eslintrc.js' configuration you will need to migrate any custom config to the new file."
    );
    fs.copyFileSync(path.join(ownPath, "./config/eslint.config.js.template"), "eslint.config.js");
}

// Change the type from "commonjs" to "module"
if (projectPackage.type === "commonjs") {
    console.info("Changing the type of the project to 'module'.");
    projectPackage.type = "module";
}

console.info("Updating package.json...");
await fs.promises.writeFile("package.json", JSON.stringify(projectPackage, undefined, 4), "utf8");

console.info("Running npm install...");
spawn.sync("npm", ["install"]);
