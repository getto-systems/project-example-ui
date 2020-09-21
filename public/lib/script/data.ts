export type PagePathname = Readonly<_PagePathname>

export function initPagePathname(url: Readonly<URL>): PagePathname {
    return url.pathname as _PagePathname
}

type _PagePathname = string & { PagePathname: never }

export type ScriptPath = Readonly<_ScriptPath>

export function initScriptPath(scriptPath: string): ScriptPath {
    return scriptPath as _ScriptPath
}

export function scriptPathToString(scriptPath: ScriptPath): Readonly<string> {
    return scriptPath as unknown as string
}

type _ScriptPath = string & { ScriptPath: never }

export type CheckError =
    Readonly<{ type: "not-found" }> |
    Readonly<{ type: "infra-error", err: string }>

export type ScriptEvent =
    Readonly<{ type: "try-to-load", scriptPath: ScriptPath }> |
    Readonly<{ type: "failed-to-load", err: CheckError }>
