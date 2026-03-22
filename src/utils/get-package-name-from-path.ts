function isScoped(input: string): boolean {
    return input.startsWith("@");
}

/**
 * Get the package name of a given import path, i.e. it strips the subpath if present.
 *
 * For example:
 *
 * - `@org/pkg` becomes `@org/pkg`
 * - `@org/pkg/subpath` becomes `@org/pkg`
 * - `pkg` becomes `pkg`
 * - `pkg/subpath` becomes `pkg`
 *
 * @internal
 */
export function getPackageNameFromPath(input?: string | null): string | null {
    if (!input) {
        return null;
    }

    if (input.startsWith(".") || input.startsWith("/")) {
        return null;
    }

    const parts = input.split("/");
    if (isScoped(input) && parts.length > 1) {
        return `${parts[0]}/${parts[1]}`;
    } else {
        return parts[0];
    }
}
