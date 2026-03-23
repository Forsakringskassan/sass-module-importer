import path from "node:path";
import { pathToFileURL } from "node:url";

import resolvePackagePath from "resolve-package-path";
import { exports, legacy } from "resolve.exports";
import { type FileImporter } from "sass";
import {
    isErrnoError,
    isWebpackPrefix,
    memoize,
    parseImport,
    readJsonFile,
} from "./utils";

interface PackageJson {
    name: string;
}

const { findUpPackagePath } = resolvePackagePath;

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

        /* strip the leading webpack `~` prefix if present */
        if (isWebpackPrefix(url)) {
            findUrl = url.slice(1);
        }

        /* parse the import url to the package name and subpath */
        const { name, subpath } = parseImport(findUrl);
        if (!name) {
            return null;
        }

        const cwd = process.cwd();
        let packageJson: PackageJson = getSelfPackageJson(cwd);
        let packagePath: string = getSelfPackagePath(cwd);

        if (packageJson.name !== name) {
            const localPath = resolvePackagePath(name, cwd);

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
            const match = exports(packageJson, subpath.slice(1), {
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
        if (subpath === "") {
            const match = legacy(packageJson, { fields: ["sass", "main"] });
            if (match && typeof match === "string") {
                return new URL(
                    pathToFileURL(path.join(moduleDirectory, match)),
                );
            }
        }

        /* Direct link */
        const directory = path.dirname(subpath);
        const fileName = path.basename(subpath);

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
