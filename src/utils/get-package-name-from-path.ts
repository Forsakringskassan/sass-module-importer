/* eslint-disable-next-line sonarjs/slow-regex, sonarjs/no-empty-after-reluctant -- technical debt */
const SCOPED_PACKAGE = /^(@[^/]+\/[^/@]+).*?$/;
/* eslint-disable-next-line sonarjs/slow-regex, sonarjs/no-empty-after-reluctant -- technical debt */
const NON_SCOPED_PACKAGE = /^([^/@]+).*?$/;

export function getPackageNameFromPath(input?: string | null): string | null {
    if (!input) {
        return null;
    }

    const match = SCOPED_PACKAGE.exec(input) ?? NON_SCOPED_PACKAGE.exec(input);
    if (!match) {
        return null;
    }

    return match[1];
}
