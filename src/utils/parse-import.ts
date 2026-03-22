import { getPackageNameFromPath } from "./get-package-name-from-path";

/**
 * Parse an import URL into a package name and subpath.
 *
 * Subpath will be an empty string if not present in the import URL.
 *
 * @internal
 */
export function parseImport(
    url: string,
): { name: string; subpath: string } | { name: null; subpath: null } {
    const name = getPackageNameFromPath(url);
    if (!name) {
        return { name: null, subpath: null };
    }
    const subpath = url.replace(name, "");
    return { name, subpath };
}
