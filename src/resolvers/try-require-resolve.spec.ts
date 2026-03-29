import { pathToFileURL } from "node:url";
import { expect, it } from "vitest";
import { tryRequireResolve } from "./try-require-resolve";

function mockRequire(resolved: string[]): { resolve: (id: string) => string } {
    const files = new Set(resolved);
    return {
        resolve(id: string) {
            if (files.has(id)) {
                return id;
            }
            throw Object.assign(new Error(`Cannot find module '${id}'`), {
                code: "MODULE_NOT_FOUND",
            });
        },
    };
}

it("should return null for an empty subpath", () => {
    expect.assertions(1);
    const require = mockRequire([]);
    expect(tryRequireResolve("", "/modules", require)).toBeNull();
});

it("should return null when no variant resolves", () => {
    expect.assertions(1);
    const require = mockRequire([]);
    expect(tryRequireResolve("/styles/main", "/modules", require)).toBeNull();
});

it("should resolve filename.css", () => {
    expect.assertions(1);
    const require = mockRequire(["/modules/styles/main.css"]);
    expect(tryRequireResolve("/styles/main", "/modules", require)).toEqual(
        new URL(pathToFileURL("/modules/styles/main.css")),
    );
});

it("should resolve filename.scss", () => {
    expect.assertions(1);
    const require = mockRequire(["/modules/styles/main.scss"]);
    expect(tryRequireResolve("/styles/main", "/modules", require)).toEqual(
        new URL(pathToFileURL("/modules/styles/main.scss")),
    );
});

it("should resolve _filename.scss", () => {
    expect.assertions(1);
    const require = mockRequire(["/modules/styles/_main.scss"]);
    expect(tryRequireResolve("/styles/main", "/modules", require)).toEqual(
        new URL(pathToFileURL("/modules/styles/_main.scss")),
    );
});

it("should resolve literal filename", () => {
    expect.assertions(1);
    const require = mockRequire(["/modules/styles/main"]);
    expect(tryRequireResolve("/styles/main", "/modules", require)).toEqual(
        new URL(pathToFileURL("/modules/styles/main")),
    );
});

it("should resolve directory import", () => {
    expect.assertions(1);
    const require = mockRequire(["/modules/styles/main/_index.scss"]);
    expect(tryRequireResolve("/styles/main", "/modules", require)).toEqual(
        new URL(pathToFileURL("/modules/styles/main/_index.scss")),
    );
});

it("should rethrow errors other than MODULE_NOT_FOUND", () => {
    expect.assertions(1);
    const permissionError = Object.assign(new Error("EACCES"), {
        code: "EACCES",
    });
    const require: { resolve: (id: string) => string } = {
        resolve() {
            throw permissionError;
        },
    };
    expect(() =>
        tryRequireResolve("/styles/main", "/modules", require),
    ).toThrow(permissionError);
});
