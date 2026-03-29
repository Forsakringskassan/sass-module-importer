import path from "node:path";
import process from "node:process";
import { compileString } from "sass";
import { expect, it, vi } from "vitest";
import { moduleImporter } from "./importer";

const fixturesPath = path.join(import.meta.dirname, "../fixtures");

function init(scss: string): string {
    const spyProcess = vi.spyOn(process, "cwd");
    spyProcess.mockReturnValue(fixturesPath);

    return compileString(scss, {
        style: "expanded",
        importers: [moduleImporter()],
    }).css;
}

it("should be able to transform scss using package without exports and main fields", () => {
    expect.assertions(1);
    const append = `
        @use "@forsakringskassan/a-fancy-package/src/default.scss";
        @use "@forsakringskassan/a-fancy-package/src/extra.scss";
        @use "@forsakringskassan/a-fancy-package/src/reset";
    `;
    expect(init(append)).toMatchSnapshot();
});

it("should be able to import scss file with same name as package name", () => {
    expect.assertions(1);
    const append = `
        @use "get-css-variables/src/get-css-variables";
    `;
    expect(init(append)).toMatchSnapshot();
});

it("should be able to transform webpack like paths", () => {
    expect.assertions(1);
    const append = `
        @use "~@forsakringskassan/a-fancy-package/src/default.scss";
    `;
    expect(init(append)).toMatchSnapshot();
});

it("should be able to transform scss using package with exports", () => {
    expect.assertions(1);
    const append = `
        @use "@forsakringskassan/package-with-exports";
        @use "@forsakringskassan/package-with-exports/anotherFile";
    `;
    expect(init(append)).toMatchSnapshot();
});

it("should be able to transform scss using package with main field", () => {
    expect.assertions(1);
    const append = `
        @use "@forsakringskassan/package-with-main-field";
    `;
    expect(init(append)).toMatchSnapshot();
});

it("should be able to transform scss using package with sass fields", () => {
    expect.assertions(1);
    const append = `
        @use "@forsakringskassan/package-with-sass-field";
    `;
    expect(init(append)).toMatchSnapshot();
});

it("should be able to transform scss when package contains reference to itself", () => {
    expect.assertions(1);
    const append = `
        @use "@forsakringskassan/self-package/src/main";
    `;
    expect(init(append)).toMatchSnapshot();
});

it("should be able to transform directory imports (index files)", () => {
    expect.assertions(1);
    const append = `
        @use "~@forsakringskassan/a-fancy-package/src/directory";
    `;
    expect(init(append)).toMatchSnapshot();
});
