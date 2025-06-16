import process from "node:process";

import { compileString } from "sass";
import { moduleImporter } from "./importer";

function init(append) {
    const spyProcess = import.meta.jest.spyOn(process, "cwd");

    spyProcess.mockReturnValue("./fixtures");

    const scss = `
        ${append}
        .foo {
            color: green;
        }
    `;

    return compileString(scss, {
        style: "expanded",
        importers: [moduleImporter],
    }).css;
}

it("should be able to transform scss using package without exports and main fields", () => {
    const append = `
        @use "@forsakringskassan/a-fancy-package/src/default.scss";
        @use "@forsakringskassan/a-fancy-package/src/extra.scss";
        @use "@forsakringskassan/a-fancy-package/src/reset";
    `;
    expect(init(append)).toMatchSnapshot();
});

it("should be able to import scss file with same name as package name", () => {
    const append = `
        @use "get-css-variables/src/get-css-variables";
    `;
    expect(init(append)).toMatchSnapshot();
});

it("should be able to transform webpack like paths", () => {
    const append = `
        @use "~@forsakringskassan/a-fancy-package/src/default.scss";
    `;
    expect(init(append)).toMatchSnapshot();
});

it("should be able to transform scss using package with exports", () => {
    const append = `
        @use "@forsakringskassan/package-with-exports";
        @use "@forsakringskassan/package-with-exports/anotherFile";
    `;
    expect(init(append)).toMatchSnapshot();
});

it("should be able to transform scss using package with main field", () => {
    const append = `
        @use "@forsakringskassan/package-with-main-field";
    `;
    expect(init(append)).toMatchSnapshot();
});

it("should be able to transform scss using package with sass fields", () => {
    const append = `
        @use "@forsakringskassan/package-with-sass-field";
    `;
    expect(init(append)).toMatchSnapshot();
});

it("should be able to transform scss when package contains reference to itself", () => {
    const append = `
        @use "@forsakringskassan/self-package/src/main";
    `;
    expect(init(append)).toMatchSnapshot();
});
