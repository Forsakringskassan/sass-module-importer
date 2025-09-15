import defaultConfig, { defineConfig } from "@forsakringskassan/eslint-config";
import cliConfig from "@forsakringskassan/eslint-config-cli";
import jestConfig from "@forsakringskassan/eslint-config-jest";

export default [
    defineConfig({
        name: "Ignored files",
        ignores: [
            "**/coverage/**",
            "**/dist/**",
            "**/node_modules/**",
            "**/temp/**",
        ],
    }),

    defineConfig({
        ignores: ["*.d.ts"],
    }),

    ...defaultConfig,

    cliConfig(),
    jestConfig(),
];
