module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 2018,
        project: "./tsconfig.json",
        sourceType: "module",
    },
    plugins: ["@typescript-eslint", "react", "react-hooks"],
    env: {
        browser: true,
        commonjs: true,
        node: true,
    },
    settings: {
        react: {
            version: "detect",
        },
    },
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "plugin:react/recommended",
        "prettier",
        "prettier/@typescript-eslint",
        "prettier/react",
    ],
    rules: {
        "@typescript-eslint/explicit-function-return-type": "off",
        "react/prop-types": "off",
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",
    },
};
