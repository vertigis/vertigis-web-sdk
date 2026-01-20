This project was bootstrapped with the [VertiGIS Studio Web SDK](https://github.com/vertigis/vertigis-web-sdk).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the project in development mode. Open [http://localhost:3001](http://localhost:3001) to view it in the browser.

The page will automatically reload if you make changes to the code. You will see build errors and warnings in the console.

#### Command Line Arguments

The `start` script supports the following optional arguments that are passed along to [webpack-dev-server](https://github.com/webpack/webpack-dev-server/tree/main?tab=readme-ov-file).

-   `--allowed-hosts` - Default is `all`. [[docs](https://github.com/webpack/webpack-dev-server/blob/main/DOCUMENTATION-v4.md#devserverallowedhosts)]
-   `--host` - Default is `localhost`. [[docs](https://github.com/webpack/webpack-dev-server/blob/main/DOCUMENTATION-v4.md#devserverhost)]
-   `--port` - Default is `3001`. [[docs](https://github.com/webpack/webpack-dev-server/blob/main/DOCUMENTATION-v4.md#devserverport)]
-   `--type` - Server type. Default is `http` for localhost and `https` for all other endpoints. [[docs](https://github.com/webpack/webpack-dev-server/blob/main/DOCUMENTATION-v4.md#devserverserver)]
-   `--key` - Provide a private key in PEM format. [[docs](https://developers.vertigisstudio.com/docs/workflow/sdk-web-overview/#configuring-a-https-certificate)]
-   `--cert` - Provide a certificate chain in PEM format. [[docs](https://developers.vertigisstudio.com/docs/workflow/sdk-web-overview/#configuring-a-https-certificate)]
-   `--ca` - Override the trusted CA certificates. [[docs](https://developers.vertigisstudio.com/docs/workflow/sdk-web-overview/#configuring-a-https-certificate)]

NOTE: It is important to add `--` before the list of parameters.

Example:

```sh
npm start -- --host 0.0.0.0 --allowed-hosts auto
```

### `npm run build`

Builds the library for production to the `build` folder. It optimizes the build for the best performance.

Your custom library is now ready to be deployed!

See the [section about deployment](https://developers.vertigis.com/docs/web/sdk-deployment/) in the [Developer Center](https://developers.vertigis.com/docs/web/overview/) for more information.

## Upgrading

To update a previously created project to the latest version of the Web SDK, navigate to the root directory of that project and run

```sh
npx @vertigis/web-sdk@latest upgrade
```

## Learn More

Find [further documentation on the SDK](https://developers.vertigis.com/docs/web/sdk-overview/) on the [VertiGIS Studio Developer Center](https://developers.vertigis.com/docs/web/overview/)
