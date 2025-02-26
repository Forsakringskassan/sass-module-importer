import { build } from "esbuild";

await build({
    entryPoints: ["./src/importer.js"],
    outdir: "./dist",
    minify: false,
    bundle: true,
    external: ["resolve-package-path", "resolve.exports"],
    platform: "node",
    format: "esm",
    target: "node20",
});
