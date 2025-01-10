module.exports = {
    preset: "@forsakringskassan/jest-config",
    moduleNameMapper: {
        "@forsakringskassan/a-fancy-package/(.*).css":
            "<rootDir>/fixtures/a-fancy-package/$1",
    },
};
