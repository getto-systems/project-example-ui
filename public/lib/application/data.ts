export type PagePathname = string & { PagePathname: never }
export function markPagePathname(pathname: string): PagePathname {
    return pathname as string & { PagePathname: never }
}

export type ScriptPath = string & { ScriptPath: never }
export function markScriptPath(path: string): ScriptPath {
    return path as string & { ScriptPath: never }
}

export type LoadError = Readonly<{ type: "infra-error"; err: string }>
