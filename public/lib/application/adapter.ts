import { PagePathname, ScriptPath } from "./data"

export function packPagePathname(url: URL): PagePathname {
    return url.pathname as PagePathname & string
}

export function unpackPagePathname(pagePathname: PagePathname): string {
    return (pagePathname as unknown) as string
}

export function packScriptPath(scriptPath: string): ScriptPath {
    return scriptPath as ScriptPath & string
}

export function unpackScriptPath(scriptPath: ScriptPath): string {
    return (scriptPath as unknown) as string
}
