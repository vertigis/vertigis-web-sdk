import { defineConfig } from "eslint/config";

import eslintConfig from "./config/eslint.config.js";

export default defineConfig([
    eslintConfig,
    {
        rules: {
            "@typescript-eslint/no-var-requires": "off",
        },
    },
]);
