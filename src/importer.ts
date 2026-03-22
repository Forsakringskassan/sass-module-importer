import path from "node:path";
import { pathToFileURL } from "node:url";

import resolvePackagePath from "resolve-package-path";
import { exports, legacy } from "resolve.exports";
import { type FileImporter } from "sass";

import { getPackageNameFromPath } from "./parse-package-name";
import { isErrnoError, memoize, readJsonFile } from "./utils";

interface PackageJson {
    name: string;
}

const { findUpPackagePath } = resolvePackagePath;
const WEBPACK_NODE_MODULE_PREFIX = "~";

const getSelfPackagePath = memoize((cwd: string) => {
    const selfPackageJsonPath = findUpPackagePath(cwd);
    if (!selfPackageJsonPath) {
        throw new Error("Could not find package.json");
    }
    return selfPackageJsonPath;
});

const getSelfPackageJson = memoize((cwd: string) => {
    const filePath = getSelfPackagePath(cwd);
    return readJsonFile(filePath) as PackageJson;
});

export const moduleImporter: FileImporter = {
    findFileUrl(url) {
        let findUrl = url;
        if (url.startsWith(WEBPACK_NODE_MODULE_PREFIX)) {
            findUrl = url.slice(1);
        }

        /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- technical debt */
        const packageName = getPackageNameFromPath(findUrl)!;
        const filePath = findUrl.replace(packageName, "");

        /* Validate if packageName is valid */
        if (!packageName) {
            return null;
        }

        const cwd = process.cwd();
        let packageJson: PackageJson = getSelfPackageJson(cwd);
        let packagePath: string = getSelfPackagePath(cwd);

        if (packageJson.name !== packageName) {
            const localPath = resolvePackagePath(packageName, cwd);

            /* Validate if existing package */
            if (!localPath) {
                return null;
            }

            packageJson = readJsonFile(localPath) as PackageJson;
            packagePath = localPath;
        }

        const moduleDirectory = path.dirname(packagePath);

        /* Check exports */
        try {
            const match = exports(packageJson, filePath.slice(1), {
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
            if (match && typeof match === "string") {
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
            fileName,
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
                if (isErrnoError(err) && err.code !== "MODULE_NOT_FOUND") {
                    throw err;
                }
            }
        }
        return null;
    },
};
