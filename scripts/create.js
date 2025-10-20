// @ts-check
"use strict";

import path from "node:path";
import { fileURLToPath } from "node:url";

import sdkCreate from "@vertigis/sdk-library/scripts/create.js";

// Root of the SDK installation where the template is found.
const dirName = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(dirName, "..");

// Target directory name.
const createIndex = process.argv.findIndex(s => s.includes("create"));
const directoryName = process.argv[createIndex + 1];

sdkCreate(rootDir, directoryName, "web");
