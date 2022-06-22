#!/usr/bin/env node
// @ts-check
"use strict";

const args = process.argv.slice(2);

const scriptIndex = args.findIndex(
    (x) => x === "build" || x === "create" || x === "start" || x === "upgrade"
);
const script = scriptIndex === -1 ? args[0] : args[scriptIndex];

if (["build", "create", "start", "upgrade"].includes(script)) {
    require(`../scripts/${script}`);
} else {
    console.error('Unknown script "' + script + '".');
}
