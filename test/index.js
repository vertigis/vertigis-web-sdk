// @ts-check
"use strict";

import path from "path";
import { fileURLToPath } from "url";

import { $ } from "execa";

// Will be set on child processes (via execa).
process.env.OPEN_BROWSER = "false";
process.env.SDK_LOCAL_DEV = "true";
process.env.ROOT_DIRECTORY = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
process.env.TEST_PROJECT_PATH = path.join(process.env.ROOT_DIRECTORY, "test-lib");
process.env.SMOKE_TEST = "true";
process.env.SDK_PLATFORM = "web";

await $({
    node: true,
    stderr: "inherit",
    stdout: "inherit",
})`node_modules/@vertigis/sdk-library/test/e2e/tests.js`;
