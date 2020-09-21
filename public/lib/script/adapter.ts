import { PagePathname, ScriptPath } from "./data"

export function initPagePathname(url: Readonly<URL>): PagePathname {
    return url.pathname as _PagePathname
}

export function pagePathnameToString(pagePathname: PagePathname): Readonly<string> {
    return pagePathname as unknown as string
}

type _PagePathname = string & PagePathname

export function initScriptPath(scriptPath: string): ScriptPath {
    return scriptPath as _ScriptPath
}

export function scriptPathToString(scriptPath: ScriptPath): Readonly<string> {
    return scriptPath as unknown as string
}

type _ScriptPath = string & ScriptPath
