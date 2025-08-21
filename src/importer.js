import path from "node:path";
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { createRequire } from "node:module";

import resolvePackagePath from "resolve-package-path";
import { exports, legacy } from "resolve.exports";

import { getPackageNameFromPath } from "./parsePackageName";

const { findUpPackagePath } = resolvePackagePath;
const require = createRequire(import.meta.url);
const WEBPACK_NODE_MODULE_PREFIX = "~";

let selfPackageJson = null;
let selfPackageJsonPath = null;
export const moduleImporter = {
    findFileUrl(url) {
        setSelfPackage();

        let findUrl = url;
        if (url.startsWith(WEBPACK_NODE_MODULE_PREFIX)) {
            findUrl = url.substring(1);
        }

        const packageName = getPackageNameFromPath(findUrl);
        const filePath = findUrl.replace(packageName, "");

        /* Validate if packageName is valid */
        if (!packageName) {
            return null;
        }

        let packageJson = selfPackageJson;
        let packagePath = selfPackageJsonPath;

        if (selfPackageJson.name !== packageName) {
            packagePath = resolvePackagePath(packageName, process.cwd());

            /* Validate if existing package */
            if (!packagePath) {
                return null;
            }

            packageJson = JSON.parse(
                readFileSync(packagePath, { encoding: "utf-8" }),
            );
        }

        const moduleDirectory = path.dirname(packagePath);

        /* Check exports */
        try {
            const match = exports(packageJson, filePath.substring(1), {
                conditions: ["sass"],
            });
            if (match && match.length === 1) {
                return new URL(
                    pathToFileURL(path.join(moduleDirectory, match[0])),
                );
            }
        } catch {
            /* empty */
        }

        /* Check main fields (only applies if only package path is given) */
        if (!filePath) {
            const match = legacy(packageJson, { fields: ["sass", "main"] });
            if (match) {
                return new URL(
                    pathToFileURL(path.join(moduleDirectory, match)),
                );
            }
        }

        /* Direct link */
        const directory = path.dirname(filePath);
        const fileName = path.basename(filePath);

        const search = [
            `${fileName}.css`,
            `${fileName}.scss`,
            `_${fileName}.scss`,
            `${fileName}`,
            `${fileName}/_index.scss`,
        ];

        for (const variant of search) {
            try {
                const moduleName = path.posix.join(
                    moduleDirectory,
                    directory,
                    variant,
                );
                const resolved = require.resolve(moduleName);
                return new URL(pathToFileURL(resolved));
            } catch (err) {
                if (err.code !== "MODULE_NOT_FOUND") {
                    throw err;
                }
            }
        }
        return null;
    },
};

function setSelfPackage() {
    if (!selfPackageJson) {
        selfPackageJsonPath = findUpPackagePath(process.cwd());
        selfPackageJson = JSON.parse(
            readFileSync(selfPackageJsonPath, { encoding: "utf-8" }),
        );
    }
}
