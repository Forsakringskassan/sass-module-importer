import { expect, it } from "vitest";
import { getPackageNameFromPath } from "./get-package-name-from-path";

it("should return null if invalid package paths", () => {
    expect.assertions(3);
    expect(getPackageNameFromPath()).toBeNull();
    expect(getPackageNameFromPath("")).toBeNull();
    expect(getPackageNameFromPath(null)).toBeNull();
});

it("should return null for local paths", () => {
    expect.assertions(3);
    expect(getPackageNameFromPath(".")).toBeNull();
    expect(getPackageNameFromPath("./path")).toBeNull();
    expect(getPackageNameFromPath("/absolute/path")).toBeNull();
});

it("should be able to parse scoped packages", () => {
    expect.assertions(4);
    expect(getPackageNameFromPath("@fancyScope/fancyPackage")).toBe(
        "@fancyScope/fancyPackage",
    );
    expect(getPackageNameFromPath("@fancyScope/fancyPackage/")).toBe(
        "@fancyScope/fancyPackage",
    );
    expect(
        getPackageNameFromPath("@fancyScope/fancyPackage/filePath.css"),
    ).toBe("@fancyScope/fancyPackage");
    expect(
        getPackageNameFromPath(
            "@fancyScope/fancyPackage/deep/filePathWithoutExtension",
        ),
    ).toBe("@fancyScope/fancyPackage");
});

it("should be able to parse non scoped packages", () => {
    expect.assertions(4);
    expect(getPackageNameFromPath("fancyPackage/path")).toBe("fancyPackage");
    expect(getPackageNameFromPath("fancyPackage/path/")).toBe("fancyPackage");
    expect(getPackageNameFromPath("fancyPackage/path/filePath.css")).toBe(
        "fancyPackage",
    );
    expect(
        getPackageNameFromPath(
            "fancyPackage/path/deep/filePathWithoutExtension",
        ),
    ).toBe("fancyPackage");
});
