#!/usr/bin/env node
// @ts-check
"use strict";

// NOTE: We use es5 syntax in this module before we do our min Node version check

var chalk = require("chalk");
var semver = require("semver");

var requiredNodeVersion = require("../package.json").engines.node;
var currentNodeVersion = process.versions.node;

if (!semver.satisfies(currentNodeVersion, requiredNodeVersion)) {
    console.error(
        chalk.red(
            "You are running Node " +
                chalk.bold(currentNodeVersion) +
                ".\n" +
                "The Geocortex Web SDK requires Node " +
                chalk.bold(requiredNodeVersion) +
                " or later. \n" +
                "Please update your version of Node."
        )
    );
    process.exit(1);
}

require("./scripts/start");
