import { readFileSync } from "node:fs";

/**
 * Reads and parses a JSON file from the given file path.
 *
 * @internal
 */
/* eslint-disable-next-line @typescript-eslint/no-explicit-any -- just like
 * `JSON.parse()` this can return `any` and the caller should deal with it */
export function readJsonFile(filePath: string): any {
    const content = readFileSync(filePath, { encoding: "utf8" });
    try {
        return JSON.parse(content);
    } catch (error) {
        throw new Error(`Failed to parse JSON file at "${filePath}"`, {
            cause: error,
        });
    }
}
