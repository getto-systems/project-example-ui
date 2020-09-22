import { PagePathname, ScriptPath } from "./data"

export function initPagePathname(url: URL): PagePathname {
    return url.pathname as string & PagePathname
}

export function pagePathnameToString(pagePathname: PagePathname): string {
    return pagePathname as unknown as string
}

export function initScriptPath(scriptPath: string): ScriptPath {
    return scriptPath as string & ScriptPath
}

export function scriptPathToString(scriptPath: ScriptPath): string {
    return scriptPath as unknown as string
}
