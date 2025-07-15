import { defineConfig } from "eslint/config";

import baseConfig from "./config/eslint.config.js";

export default defineConfig([
    baseConfig,
    {
        rules: {
            "@typescript-eslint/no-var-requires": "off",
        },
    },
]);
