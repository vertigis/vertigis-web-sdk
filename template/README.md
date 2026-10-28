This project was bootstrapped with the [VertiGIS Studio Web SDK](https://github.com/vertigis/vertigis-web-sdk).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the project in development mode. Open [http://localhost:3001](http://localhost:3001) to view it in the browser.

The page will automatically reload if you make changes to the code. You will see build errors and warnings in the
console.

#### Command Line Arguments

The `start` script supports the following optional arguments that are passed along to
[webpack-dev-server](https://github.com/webpack/webpack-dev-server/tree/main?tab=readme-ov-file).

-   `--allowed-hosts` - Default is `all`.
    [[docs](https://github.com/webpack/webpack-dev-server/blob/main/DOCUMENTATION-v4.md#devserverallowedhosts)]
-   `--host` - Default is `localhost`.
    [[docs](https://github.com/webpack/webpack-dev-server/blob/main/DOCUMENTATION-v4.md#devserverhost)]
-   `--port` - Default is `3001`.
    [[docs](https://github.com/webpack/webpack-dev-server/blob/main/DOCUMENTATION-v4.md#devserverport)]
-   `--type` - Server type. Default is `http` for localhost and `https` for all other endpoints.
    [[docs](https://github.com/webpack/webpack-dev-server/blob/main/DOCUMENTATION-v4.md#devserverserver)]
-   `--key` - Provide a private key in PEM format.
    [[docs](https://developers.vertigisstudio.com/docs/workflow/sdk-web-overview/#configuring-a-https-certificate)]
-   `--cert` - Provide a certificate chain in PEM format.
    [[docs](https://developers.vertigisstudio.com/docs/workflow/sdk-web-overview/#configuring-a-https-certificate)]
-   `--ca` - Override the trusted CA certificates.
    [[docs](https://developers.vertigisstudio.com/docs/workflow/sdk-web-overview/#configuring-a-https-certificate)]

NOTE: It is important to add `--` before the list of parameters.

Example:

```sh
npm start -- --host 0.0.0.0 --allowed-hosts auto
```

### `npm run build`

Builds the library for production to the `build` folder. It optimizes the build for the best performance.

Your custom library is now ready to be deployed!

See the [section about deployment](https://developers.vertigis.com/docs/web/sdk-deployment/) in the
[Developer Center](https://developers.vertigis.com/docs/web/overview/) for more information.

### `npm run changelog`

You must have compiled the project at least once to run this script, and the script must be in the default location of
`build/main.js`. It will output a changelog in markdown format covering changes from _when that script was compiled_ to
the present day.

Run this _before_ upgrading to view the changes you may need to account for afterwards.

The changelog script supports the following optional arguments:

-   `--breakingOnly` - Only show breaking changes when this flag is present.
-   `--path` - The path to the script to generate a changelog for. The default is `./build/main.js`.
-   `--date` - Provide a date in the past and generate a changelog from then to the present. The date should be in ISO
    format (YYYY-MM-DD).

The date parameter ignores the software versions embedded in the library and can be useful for older libraries that do
not have this.

NOTE: It is important to add `--` before the list of parameters.

Example

```sh
npm run changelog -- --date 2025-10-20 --breakingOnly
```

Save the output to a file

```sh
npm run -s changelog > CHANGELOG.md
```

### `npm run upgrade`

This script is shorthand for navigating to the root of the project and running:

```sh
npx @vertigis/web-sdk@latest upgrade
```

It's important to always target the latest Web SDK version when performing the upgrade operation.

## Learn More

Find [further documentation on the SDK](https://developers.vertigis.com/docs/web/sdk-overview/) on the
[VertiGIS Studio Developer Center](https://developers.vertigis.com/docs/web/overview/)
