export type Version = string & { Version: never }
export function markVersion(version: string): Version {
    return version as Version
}

export type FindCurrentVersionEvent =
    | Readonly<{ type: "succeed-to-find"; version: Version }>
