require("@forsakringskassan/eslint-config/patch/modern-module-resolution");

module.exports = {
    root: true,
    extends: ["@forsakringskassan"],

    overrides: [
        {
            files: ["*.cjs", "*.mjs"],
        },
        {
            files: ["./*.{js,ts,cjs,mjs}", "**/scripts/*.{js,ts,cjs,mjs}"],
            extends: ["@forsakringskassan/cli"],
        },
        {
            files: "*.spec.[jt]s",
            extends: ["@forsakringskassan/jest"],
        },
    ],
};
