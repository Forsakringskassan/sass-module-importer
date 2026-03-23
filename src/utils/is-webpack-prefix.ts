const WEBPACK_NODE_MODULE_PREFIX = "~";

/**
 * Returns `true` if the given URL uses the webpack `~` node module prefix.
 *
 * @internal
 */
export function isWebpackPrefix(url: string): boolean {
    return url.startsWith(WEBPACK_NODE_MODULE_PREFIX);
}
