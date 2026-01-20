// @ts-check
"use strict";

import * as path from "path";
import { fileURLToPath } from "url";

import sdkUpgrade from "@vertigis/sdk-library/scripts/upgrade.js";

const dirName = path.dirname(fileURLToPath(import.meta.url));
const ownPath = path.resolve(dirName, "..");

sdkUpgrade(ownPath, "web");
