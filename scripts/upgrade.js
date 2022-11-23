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

// Add or update all of Web's dependencies as dev dependencies of this
// project. Although this is not strictly necessary for the project to
// build, aspects of VS Code intellisense like auto imports will not
// work without this.
console.info("Determining Web dependencies...");
const response = await fetch(`https://registry.npmjs.com/@vertigis/web/${latestWeb}`);
/**
 * @type {Record<string, unknown>}
 */
const webPackage = await response.json();
for (const [dep, version] of Object.entries(webPackage.dependencies)) {
    projectPackage.devDependencies[dep] = version;
}

console.info("Updating package.json...");
await fs.promises.writeFile("package.json", JSON.stringify(projectPackage, undefined, 4), "utf8");

console.info("Running npm install...");
spawn.sync("npm", ["install"]);
