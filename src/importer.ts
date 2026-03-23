import path from "node:path";

import resolvePackagePath from "resolve-package-path";
import { type FileImporter } from "sass";
import {
    tryPackageExports,
    tryPackageMain,
    tryRequireResolve,
} from "./resolvers";
import { type PackageJson } from "./types";
import { isWebpackPrefix, memoize, parseImport, readJsonFile } from "./utils";

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

function lazyEvaluateEach(fns: Array<() => URL | null>): URL | null {
    for (const fn of fns) {
        const result = fn();
        if (result) {
            return result;
        }
    }
    return null;
}

export function moduleImporter(): FileImporter {
    return {
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

            return lazyEvaluateEach([
                () => tryPackageExports(packageJson, subpath, moduleDirectory),
                () => tryPackageMain(packageJson, subpath, moduleDirectory),
                () => tryRequireResolve(subpath, moduleDirectory, require),
            ]);
        },
    };
}
