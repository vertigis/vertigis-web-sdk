#!/usr/bin/env node
// @ts-check
"use strict";

// NOTE: We use es5 syntax in this module before we do our min Node version check

var semver = require("semver");

var requiredNodeVersion = require("../package.json").engines.node;
var currentNodeVersion = process.versions.node;

if (!semver.satisfies(currentNodeVersion, requiredNodeVersion)) {
    console.error(
        "You are running Node " +
            currentNodeVersion +
            ".\n" +
            "The Geocortex Web SDK requires Node " +
            requiredNodeVersion +
            " or later. \n" +
            "Please update your version of Node."
    );
    process.exit(1);
}

require("./start");
