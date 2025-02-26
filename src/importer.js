import path from "node:path";
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { createRequire } from "node:module";

import resolvePackagePath from "resolve-package-path";
import { exports, legacy } from "resolve.exports";

import { getPackageNameFromPath } from "./parsePackageName";

const require = createRequire(import.meta.url);
const WEBPACK_NODE_MODULE_PREFIX = "~";
export const moduleImporter = {
    findFileUrl(url) {
        let findUrl = url;
        if (url.startsWith(WEBPACK_NODE_MODULE_PREFIX)) {
            findUrl = url.substring(1);
        }

        const packageName = getPackageNameFromPath(findUrl);
        const fileName = findUrl.split(packageName)[1];
        const packagePath = resolvePackagePath(packageName, process.cwd());

        /* Validate if existing package */
        if (!packageName || !packagePath) {
            return null;
        }

        const packageJson = JSON.parse(
            readFileSync(packagePath, { encoding: "utf-8" }),
        );

        const moduleDirectory = path.dirname(packagePath);

        /* Check exports */
        try {
            const match = exports(packageJson, fileName.substring(1), {
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
        if (!fileName) {
            const match = legacy(packageJson, { fields: ["sass", "main"] });
            if (match) {
                return new URL(
                    pathToFileURL(path.join(moduleDirectory, match)),
                );
            }
        }

        /* Direct link */
        const search = [
            `${fileName}.css`,
            `${fileName}.scss`,
            `_${fileName}.scss`,
            `${fileName}`,
        ];

        for (const variant of search) {
            try {
                const moduleName = path.posix.join(moduleDirectory, variant);
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
