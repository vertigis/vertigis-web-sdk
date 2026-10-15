# CLAUDE.md

## Key Rules

-   Do not run a command unless the user asks for it. Example: do not build or test after a change.
-   Do not add a dependency unless the user asks for it.
-   Obey the rules in this file also when the existing code does not. The rules are always correct.
-   Write all messages in ASD-STE100 Simplified Technical English. You can use technical names and verbs from the code.
    Examples: `React`, `ESLint`, `npm`, file names, and function names.

## The Repository

This repository is `@vertigis/web-sdk`. It is a JavaScript CLI that creates, starts, builds, and upgrades custom
libraries for VertiGIS Studio Web.

-   Most of the logic is in `@vertigis/sdk-library`. The Workflow SDK also uses that package. This repository contains
    only the Web-specific parts.
-   `bin/vertigis-web-sdk.js` sends each CLI command to the applicable file in `scripts/`.
-   `config/` contains the webpack, ESLint, and TypeScript configuration for user projects. `create` and `upgrade` copy
    the `*.template` files into user projects.
-   `template/` is the sample project that `create` copies. A change to `config/` or `template/` changes all new user
    projects.
-   `semantic-release` releases the package from `master`, The version in `package.json` is a placeholder. Do not change
    it.
-   A `CHANGELOG.md` file is maintained. Only **user facing** changes are included. Do not record changes from the
    `@vertigis/sdk-library` dependency.

## Commands

-   `npm install`: Install the dependencies.
-   `npm test`: Run the end-to-end tests.
-   `npm run create -- <name>`: Create a project that uses the local SDK.
-   `npm run prettier`: Format all files with Prettier.

## Code Rules

-   Write plain JavaScript as ES modules. Do not write TypeScript files.
-   Start each file with `// @ts-check` and `"use strict";`.
-   Use JSDoc for all types.
-   Obey `.prettierrc` and `eslint.config.js`.
-   Put logic that the Web SDK and the Workflow SDK share in `@vertigis/sdk-library`, not here.
-   In `template/`, use TypeScript. Import UI components from `@vertigis/web/ui`.
-   Write PR titles in the Conventional Commits format. The PR title sets the release version.

## Tests

-   `npm test` runs `test/index.js`. This file sets environment variables and runs the shared end-to-end tests in
    `@vertigis/sdk-library`.
-   The tests create a project in `test-lib/`. Then they build, start, and upgrade it.
-   This repository has no unit tests. To change a test, change `@vertigis/sdk-library`.
