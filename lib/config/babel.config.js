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
            // Necessary to include regardless of the environment because
            // in practice some other transforms (such as object-rest-spread)
            // don't work without it: https://github.com/babel/babel/issues/7215
            [
                require("@babel/plugin-transform-destructuring").default,
                {
                    // Use loose mode for performance:
                    // https://github.com/facebook/create-react-app/issues/5602
                    loose: false,
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
            // The following two plugins use Object.assign directly, instead of Babel's
            // extends helper. Note that this assumes `Object.assign` is available.
            // { ...todo, completed: true }
            [
                require("@babel/plugin-proposal-object-rest-spread").default,
                {
                    useBuiltIns: true,
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
