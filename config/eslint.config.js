import baseConfig from "@vertigis/sdk-library/config/eslint.base.config.js";
import { defineConfig, globalIgnores } from "eslint/config";

/**
 * Adds rules specific to the Web SDK.
 */
export default defineConfig([
    globalIgnores(["**/*.cjs"]),
    baseConfig,
    {
        name: "vertigis/web-sdk/recommended",
        rules: {
            "@typescript-eslint/array-type": "warn",
            "@typescript-eslint/consistent-type-definitions": ["warn", "interface"],
            "@typescript-eslint/consistent-type-imports": [
                "warn",
                { disallowTypeAnnotations: false },
            ],
            "@typescript-eslint/explicit-module-boundary-types": "off",
            "@typescript-eslint/member-ordering": [
                "warn",
                {
                    default: [
                        // Index signature
                        "signature",
                        // Fields
                        "public-static-field",
                        "protected-static-field",
                        "private-static-field",
                        "public-field",
                        "protected-field",
                        "private-field",
                        // Constructors
                        "public-constructor",
                        "protected-constructor",
                        "private-constructor",
                        // Methods
                        "public-static-method",
                        "protected-static-method",
                        "private-static-method",
                        "public-method",
                        "protected-method",
                        "private-method",
                    ],
                },
            ],
            "@typescript-eslint/no-dupe-class-members": "warn",
            "@typescript-eslint/no-duplicate-type-constituents": "off",
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-empty-interface": "off",
            "@typescript-eslint/no-empty-object-type": "off",
            "@typescript-eslint/no-invalid-this": "warn",
            "@typescript-eslint/no-misused-promises": [
                "warn",
                {
                    checksVoidReturn: false,
                },
            ],
            "@typescript-eslint/no-redundant-type-constituents": "off",
            "@typescript-eslint/no-unnecessary-condition": "off",
            "@typescript-eslint/no-unsafe-assignment": "off",
            "@typescript-eslint/no-unsafe-call": "off",
            "@typescript-eslint/no-unsafe-enum-comparison": "off",
            "@typescript-eslint/no-unsafe-function-type": "warn",
            "@typescript-eslint/no-unsafe-member-access": "off",
            "@typescript-eslint/no-unsafe-return": "off",
            "@typescript-eslint/no-unused-vars": [
                "warn",
                {
                    args: "none",
                    ignoreRestSiblings: true,
                },
            ],
            "@typescript-eslint/no-useless-constructor": "warn",
            "@typescript-eslint/no-wrapper-object-types": "warn",
            "@typescript-eslint/prefer-for-of": "warn",
            "@typescript-eslint/prefer-function-type": "warn",
            "@typescript-eslint/prefer-includes": "warn",
            "@typescript-eslint/prefer-optional-chain": "warn",
            "@typescript-eslint/prefer-readonly": "warn",
            "@typescript-eslint/prefer-reduce-type-parameter": "warn",
            "@typescript-eslint/prefer-regexp-exec": "off",
            "@typescript-eslint/prefer-string-starts-ends-with": "warn",
            "@typescript-eslint/no-floating-promises": "warn",
            "@typescript-eslint/promise-function-async": "off",
            "@typescript-eslint/restrict-template-expressions": "off",
            "@typescript-eslint/require-await": "off",
            "@typescript-eslint/switch-exhaustiveness-check": "warn",
            "accessor-pairs": "warn",
            "array-callback-return": "warn",
            "arrow-body-style": "warn",
            complexity: "off",
            "default-case-last": "warn",
            "default-param-last": "warn",
            eqeqeq: [
                "warn",
                "always",
                {
                    null: "ignore",
                },
            ],
            "grouped-accessor-pairs": ["warn", "getBeforeSet"],
            "import/default": "off",
            "import/export": "off",
            "import/namespace": "off",
            "import/no-amd": "off",
            "import/no-commonjs": "off",
            "import/no-duplicates": "warn",
            "import/no-named-as-default": "off",
            "import/no-named-as-default-member": "off",
            "import/no-namespace": "off",
            "import/no-unresolved": "off",
            "import/order": [
                "warn",
                {
                    alphabetize: {
                        order: "asc",
                    },
                    "newlines-between": "always",
                    groups: ["builtin", "external", ["parent", "sibling", "index"]],
                },
            ],
            "max-depth": ["warn", 4],
            "max-params": ["warn", 4],
            "no-alert": "warn",
            "no-await-in-loop": "warn",
            "no-caller": "warn",
            "no-constant-condition": [
                "warn",
                {
                    checkLoops: false,
                },
            ],
            "no-constructor-return": "warn",
            "no-duplicate-imports": "off",
            "no-eval": "warn",
            "no-extend-native": "warn",
            "no-extra-bind": "warn",
            "no-implied-eval": "warn",
            "no-labels": "warn",
            "no-lonely-if": "warn",
            "no-nested-ternary": "off",
            "no-new-object": "warn",
            "no-new-wrappers": "warn",
            "no-param-reassign": "warn",
            "no-promise-executor-return": "warn",
            "no-proto": "warn",
            "no-prototype-builtins": "off",
            "no-restricted-imports": [
                "warn",
                {
                    patterns: [
                        {
                            group: ["@mui/material/*", "@vertigis/react-ui/*"],
                            message:
                                "React UI components should always be imported from '@vertigis/web/ui' when used in a Web library.",
                        },
                    ],
                },
            ],
            "no-return-assign": "warn",
            "no-return-await": "off",
            "no-self-compare": "warn",
            "no-sequences": "warn",
            "no-template-curly-in-string": "warn",
            "no-unmodified-loop-condition": "warn",
            "no-unneeded-ternary": "warn",
            "no-unused-vars": "off",
            "no-useless-call": "warn",
            "no-useless-computed-key": "warn",
            "no-useless-concat": "warn",
            "no-useless-rename": "warn",
            "no-useless-return": "warn",
            "no-var": "warn",
            "no-void": "warn",
            "object-shorthand": "warn",
            "prefer-arrow-callback": "warn",
            "prefer-const": "warn",
            "prefer-object-spread": "warn",
            "prefer-regex-literals": "warn",
            "prefer-rest-params": "warn",
            "prefer-spread": "warn",
            "prefer-template": "warn",
            "react/display-name": "off",
            "react/no-array-index-key": "off",
            "react/no-find-dom-node": "off",
            "react/no-children-prop": "off",
            "react/no-mutation-state": "off",
            "react/require-render-return": "off",
            "react-hooks/rules-of-hooks": "error",
            "react-hooks/exhaustive-deps": "warn",
            "react/jsx-boolean-value": "warn",
            "react/jsx-key": ["warn", { checkFragmentShorthand: true }],
            "react/no-deprecated": "warn",
            "react/react-in-jsx-scope": "off",
            "react/prop-types": "off",
            "require-await": "off",
            "spaced-comment": "warn",
        },
    },
]);
