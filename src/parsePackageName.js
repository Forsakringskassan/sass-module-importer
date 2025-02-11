const SCOPED_PACKAGE = /^(@[^/]+\/[^@/]+).*?$/;
const NON_SCOPED_PACKAGE = /^([^@/]+).*?$/;

export function getPackageNameFromPath(input) {
    const match = SCOPED_PACKAGE.exec(input) || NON_SCOPED_PACKAGE.exec(input);

    if (!input || !match) {
        throw new Error(`invalid package name`);
    }

    return match[1];
}
