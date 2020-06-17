// @ts-check
"use strict";

process.env.OPEN_BROWSER = "false";
process.env.SDK_LOCAL_DEV = "true";

const execa = require("execa");
const assert = require("assert").strict;
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright-chromium");
const pRetry = require("p-retry");

const rootDir = path.join(__dirname, "..");
const testLibProjPath = path.join(rootDir, "test-lib");

/** @type {execa.ExecaChildProcess<string>} */
let subprocess;

/**
 * @param {Array<string>} args
 * @param {execa.Options<string>} [opts]
 */
function runNpmScript(args, opts) {
    console.log(`Executing CLI script: ${args.join(" ")}`);
    const scriptProcess = execa(
        "node",
        [path.join(rootDir, "bin/vertigis-web-sdk.js"), ...args],
        opts
    );

    // Pipe process output to current process output so it is visible in the
    // console, but still allows us to examine the subprocess stdout/stderr
    // variables.
    scriptProcess.stdout.pipe(process.stdout);
    scriptProcess.stderr.pipe(process.stderr);

    return scriptProcess;
}

function killSubprocess() {
    if (subprocess && !subprocess.killed) {
        subprocess.kill();
    }
}

async function testCreateProject() {
    // First try creating the project.
    subprocess = runNpmScript(["create", "test-lib"]);
    await subprocess;

    // Try to create same named project again.
    subprocess = runNpmScript(["create", "test-lib"], { reject: false });
    const processResult = await subprocess;
    assert.strictEqual(
        processResult.stderr.includes(
            `Cannot create new project at ${testLibProjPath} as it already exists`
        ),
        true,
        "Failed to detect existing directory"
    );
}

// We assume the project was successfully created to run the following tests.
async function testBuildProject() {
    subprocess = runNpmScript(["build"], { cwd: testLibProjPath });
    await subprocess;
    assert.strictEqual(
        fs.existsSync(path.join(testLibProjPath, "build/main.js")),
        true,
        "build/main.js is missing"
    );
}

async function testStartProject() {
    subprocess = runNpmScript(["start"], { cwd: testLibProjPath });

    const browser = await chromium.launch();

    try {
        const page = await browser.newPage();
        await pRetry(() => page.goto("http://localhost:3000"), {
            maxRetryTime: 10000,
        });
        const frame = page.frame("viewer");
        await frame.waitForSelector("text=Points of Interest");
    } catch (e) {
        await browser.close();
        throw e;
    }

    await browser.close();
    killSubprocess();
}

function rmdir(path) {
    fs.rmdirSync(path, { recursive: true });
}

function cleanup() {
    console.log("Cleaning up...");
    killSubprocess();
    rmdir(testLibProjPath);
    console.log("Done cleaning.");
}

(async () => {
    try {
        await testCreateProject();
        await testBuildProject();
        await testStartProject();
        console.log("All tests passed!");
        cleanup();
    } catch (error) {
        console.error("Test failed.");
        console.error(error);
        cleanup();
        process.exit(1);
    }
})();
