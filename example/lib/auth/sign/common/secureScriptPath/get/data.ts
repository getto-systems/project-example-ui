export type LocationPathname = string & { LocationPathname: never }
export function markLocationPathname(pathname: string): LocationPathname {
    return pathname as LocationPathname
}

export type SecureScriptPath = string & { SecureScriptPath: never }
export function markSecureScriptPath(path: string): SecureScriptPath {
    return path as SecureScriptPath
}

export type LoadSecureScriptError = Readonly<{ type: "infra-error"; err: string }>
