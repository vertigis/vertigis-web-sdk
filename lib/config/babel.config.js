//@ts-check
"use strict";

module.exports = function(api, opts, env) {
    const isEnvDevelopment = env === "development";
    const isEnvProduction = env === "production";
    const isEnvTest = env === "test";

    api.cache(true);

    return {
        presets: [
            isEnvTest && [
                // ES features necessary for user's Node version
                require("@babel/preset-env").default,
                {
                    targets: {
                        node: "current",
                    },
                },
            ],
            (isEnvProduction || isEnvDevelopment) && [
                require("@babel/preset-env").default,
                {
                    ignoreBrowserslistConfig: true,
                    // Do not transform modules to CJS
                    modules: false,
                    // Same targets as GXW source
                    targets: [
                        "last 2 chrome versions",
                        "last 2 firefox versions",
                        "last 2 edge versions",
                    ],
                },
            ],
            [
                require("@babel/preset-react").default,
                {
                    // Adds component stack to warning messages
                    // Adds __self attribute to JSX which React will use for some warnings
                    development: isEnvDevelopment || isEnvTest,
                    // Will use the native built-in instead of trying to polyfill
                    // behavior for any plugins that require one.
                    useBuiltIns: true,
                },
            ],
            require("@babel/preset-typescript").default,
        ].filter(Boolean),
        plugins: [
            [
                require("@babel/plugin-transform-runtime").default,
                {
                    // By default, babel assumes babel/runtime version 7.0.0-beta.0,
                    // explicitly resolving to match the provided helper functions.
                    // https://github.com/babel/babel/issues/10261
                    version: require("@babel/runtime/package.json").version,
                    // https://babeljs.io/docs/en/babel-plugin-transform-runtime#useesmodules
                    // We should turn this on once the lowest version of Node LTS
                    // supports ES Modules.
                    useESModules: !isEnvTest,
                },
            ],
            // Turn on legacy decorators for TypeScript files
            [require("@babel/plugin-proposal-decorators").default, false],
            // class { handleClick = () => { } }
            // Enable loose mode to use assignment instead of defineProperty
            // See discussion in https://github.com/facebook/create-react-app/issues/4263
            [
                require("@babel/plugin-proposal-class-properties").default,
                {
                    loose: true,
                },
            ],
            // Adds syntax support for import()
            require("@babel/plugin-syntax-dynamic-import").default,
            isEnvTest &&
                // Transform dynamic import to require
                require("babel-plugin-dynamic-import-node"),
        ].filter(Boolean),
        overrides: [
            {
                test: /\.tsx?$/,
                plugins: [[require("@babel/plugin-proposal-decorators").default, { legacy: true }]],
            },
        ].filter(Boolean),
    };
};
