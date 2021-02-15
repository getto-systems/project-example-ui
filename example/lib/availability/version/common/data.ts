export type VersionString = string & { VersionString: never }
export function markVersionString(version: string): VersionString {
    return version as VersionString
}
