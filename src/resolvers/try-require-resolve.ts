import path from "node:path";
import { pathToFileURL } from "node:url";
import { isErrnoError } from "../utils";

/**
 * Try to resolve the path by scanning common file variants directly.
 */
export function tryRequireResolve(
    subpath: string,
    moduleDirectory: string,
    require: { resolve: (id: string) => string },
): URL | null {
    if (subpath === "") {
        return null;
    }

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
}
