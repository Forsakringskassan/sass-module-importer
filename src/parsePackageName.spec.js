import { getPackageNameFromPath } from "./parsePackageName";

it("should return null if invalid package paths", () => {
    expect(getPackageNameFromPath()).toBeNull();
    expect(getPackageNameFromPath("")).toBeNull();
    expect(getPackageNameFromPath(null)).toBeNull();
});

it("should be able to parse scoped packages", () => {
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
