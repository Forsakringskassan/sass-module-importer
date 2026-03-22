import path from "node:path";
import { pathToFileURL } from "node:url";
import { exports } from "resolve.exports";
import { type PackageJson } from "../types";

/**
 * Try to resolve the path using the `exports` field in `package.json`.
 */
export function tryPackageExports(
    packageJson: PackageJson,
    subpath: string,
    moduleDirectory: string,
): URL | null {
    try {
        const match = exports(packageJson, subpath.slice(1), {
            conditions: ["sass"],
        });
        if (match && match.length === 1) {
            return new URL(pathToFileURL(path.join(moduleDirectory, match[0])));
        }
    } catch {
        /* empty */
    }
    return null;
}
