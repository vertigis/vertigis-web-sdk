# Changelog

## [3.1.0] - 2026-08-24

### Added

-   Add a banner comment with the library ID and the versions of Web, the Web SDK, and `@vertigis/sdk-library` to the built library
-   Set `allowScripts` to false for `@mui/x-telemetry` and `@vaadin/vaadin-usage-statistics` in new projects

### Removed

-   Remove `baseUrl` from the `tsconfig.json` of new projects

## [3.0.3] - 2026-07-13

### Fixed

-   Fix the sample project for Web 5.42 (the sample does not compile with earlier versions of Web)

## [3.0.2] - 2026-04-16

### Fixed

-   Exclude `react` and `react-dom` subpath imports, such as `react/jsx-runtime`, from the bundle again (regression in 2.0.0)
-   Fix a type error in the sample project

## [3.0.1] - 2026-02-03

### Fixed

-   Include `@arcgis` packages other than `@arcgis/core` in the bundle again (regression in 2.0.0)

## [3.0.0] - 2026-01-20

### Changed

-   **Breaking:** Change the default host of `start` from `0.0.0.0` to `localhost`
-   Update TypeScript in new projects to `^5.4.0`
-   Change the Prettier print width of new projects from 100 to 120

### Added

-   Add the `--host`, `--port`, `--allowed-hosts`, `--type`, `--key`, `--cert`, and `--ca` arguments to `start`

### Removed

-   Remove the `upgrade` script from new projects (use `npx @vertigis/web-sdk@latest upgrade` instead)

## [2.0.2] - 2025-12-09

### Fixed

-   Use the `devServer` settings from the `webpack.config.js` of the project in `start`

## [2.0.1] - 2025-07-23

### Added

-   Add a `lint` script to new projects

## [2.0.0] - 2025-07-15

_To use this release with an existing project, run `npx @vertigis/web-sdk@latest upgrade` in the project folder._

### Changed

-   **Breaking:** Update ESLint from 8 to 9 and use an `eslint.config.js` flat configuration instead of `.eslintrc.js`
-   **Breaking:** Change new projects to ES modules (`"type": "module"`)
-   Make `upgrade` add `eslint.config.js` and set `"type": "module"` in existing projects
-   Make `create` initialize git with a `main` branch
-   Update TypeScript in new projects to 5.3 and Prettier to 3.5
-   Update `postcss-preset-env` from 9 to 10

### Added

-   Add support for a `webpack.config.js` file in the project folder to customize the webpack configuration
-   Add a `webpack.config.js` file to new projects

[3.1.0]: https://github.com/vertigis/vertigis-web-sdk/releases/tag/v3.1.0
[3.0.3]: https://github.com/vertigis/vertigis-web-sdk/releases/tag/v3.0.3
[3.0.2]: https://github.com/vertigis/vertigis-web-sdk/releases/tag/v3.0.2
[3.0.1]: https://github.com/vertigis/vertigis-web-sdk/releases/tag/v3.0.1
[3.0.0]: https://github.com/vertigis/vertigis-web-sdk/releases/tag/v3.0.0
[2.0.2]: https://github.com/vertigis/vertigis-web-sdk/releases/tag/v2.0.2
[2.0.1]: https://github.com/vertigis/vertigis-web-sdk/releases/tag/v2.0.1
[2.0.0]: https://github.com/vertigis/vertigis-web-sdk/releases/tag/v2.0.0
