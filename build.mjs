import { build } from "esbuild";

await build({
    entryPoints: ["./src/importer.ts"],
    outdir: "./dist",
    minify: false,
    bundle: true,
    external: ["resolve-package-path", "resolve.exports"],
    platform: "node",
    format: "esm",
    target: "node20",
    banner: {
        js: [
            "import { createRequire } from 'node:module';",
            "const require = createRequire(import.meta.url);",
        ].join("\n"),
    },
});
