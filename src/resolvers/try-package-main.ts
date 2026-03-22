import path from "node:path";
import { pathToFileURL } from "node:url";
import { legacy } from "resolve.exports";
import { type PackageJson } from "../types";

/**
 * Try to resolve the path using the `main` or `sass` field in `package.json`.
 */
export function tryPackageMain(
    packageJson: PackageJson,
    filePath: string,
    moduleDirectory: string,
): URL | null {
    if (filePath !== "") {
        return null;
    }
    const match = legacy(packageJson, { fields: ["sass", "main"] });
    if (match && typeof match === "string") {
        return new URL(pathToFileURL(path.join(moduleDirectory, match)));
    }
    return null;
}
