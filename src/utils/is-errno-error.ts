/**
 * Returns `true` if the given error is a Node.js `ErrnoException`.
 *
 * @internal
 */
export function isErrnoError(error: unknown): error is NodeJS.ErrnoException {
    return (
        error instanceof Error &&
        "code" in error &&
        typeof error.code === "string"
    );
}
