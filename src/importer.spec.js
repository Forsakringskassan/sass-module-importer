import fs from "node:fs";
import { compileString } from "sass";
import { moduleImporter } from "./importer";

it("should be able to transform scss", () => {
    const result = compileString(
        fs.readFileSync("./fixtures/main.scss", "utf-8"),
        {
            style: "expanded",
            importers: [moduleImporter],
        },
    );
    expect(result.css).toMatchSnapshot();
});
