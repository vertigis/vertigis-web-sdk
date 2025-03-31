"use strict";

// This script will update the custom library to target the latest version of
// VertiGIS Studio Web and the Web SDK.

import fetch from "node-fetch";
import * as fs from "fs";
import * as spawn from "cross-spawn";

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

console.info("Updating package.json...");
await fs.promises.writeFile("package.json", JSON.stringify(projectPackage, undefined, 4), "utf8");

console.info("Running npm install...");
spawn.sync("npm", ["install"]);
