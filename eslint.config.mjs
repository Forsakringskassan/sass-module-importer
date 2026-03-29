import defaultConfig, { defineConfig } from "@forsakringskassan/eslint-config";
import cliConfig from "@forsakringskassan/eslint-config-cli";
import typescriptConfig from "@forsakringskassan/eslint-config-typescript";
import typeinfoConfig from "@forsakringskassan/eslint-config-typescript-typeinfo";
import vitestConfig from "@forsakringskassan/eslint-config-vitest";

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
    typescriptConfig(),
    typeinfoConfig(import.meta.dirname),
    vitestConfig(),
];
