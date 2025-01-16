import fs from "node:fs";
import process from "node:process";
import { compileString } from "sass";
import { jest } from "@jest/globals";
import { moduleImporter } from "./importer";

it("should be able to transform scss", () => {
    const spyProcess = jest.spyOn(process, "cwd");
    spyProcess.mockReturnValue("../fixtures/");

    const result = compileString(
        fs.readFileSync("./fixtures/main.scss", "utf-8"),
        {
            style: "expanded",
            importers: [moduleImporter],
        },
    );
    expect(result.css).toMatchSnapshot();
});
