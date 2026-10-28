// @ts-check
"use strict";

import path from "node:path";
import { fileURLToPath } from "node:url";

import sdkChangelog from "@vertigis/sdk-library/scripts/changelog.js";

// Root of the SDK installation.
const dirName = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(dirName, "..");

const output = await sdkChangelog(rootDir, "web");

console.log(output);
