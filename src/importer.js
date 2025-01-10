import path from "node:path";
import { pathToFileURL } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const WEBPACK_NODE_MODULE_PREFIX = "~";
export const moduleImporter = {
    findFileUrl(url) {
        let findUrl = url;
        if (url.startsWith(WEBPACK_NODE_MODULE_PREFIX)) {
            findUrl = url.substring(1);
        }

        const directory = path.dirname(findUrl);
        const fileName = path.basename(findUrl);

        const search = [
            `${fileName}.css`,
            `${fileName}.scss`,
            `_${fileName}.scss`,
            `${fileName}`,
        ];

        for (const variant of search) {
            try {
                const moduleName = path.posix.join(directory, variant);
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
