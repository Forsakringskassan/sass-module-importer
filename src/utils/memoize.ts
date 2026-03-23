function cacheKey(args: Array<string | number>): string {
    return JSON.stringify(args);
}

/**
 * Memoize a function's result.
 *
 * @internal
 */
export function memoize<TReturn, TArgs extends Array<string | number>>(
    callback: (...args: TArgs) => Promise<TReturn>,
): (...args: TArgs) => Promise<TReturn>;
export function memoize<TReturn, TArgs extends Array<string | number>>(
    callback: (...args: TArgs) => TReturn,
): (...args: TArgs) => TReturn;
export function memoize(
    callback: (...args: Array<string | number>) => unknown | Promise<unknown>,
): (...args: Array<string | number>) => unknown | Promise<unknown> {
    const cache = new Map<string, unknown | Promise<unknown>>();
    return (...args: Array<string | number>) => {
        const key = cacheKey(args);
        if (!cache.has(key)) {
            cache.set(key, callback(...args));
        }
        /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- at this point we know the key will exist */
        return cache.get(key)!;
    };
}
