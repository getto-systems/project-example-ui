import { PagePathname, ScriptPath } from "./data"

export interface PathAction {
    secureScriptPath(pagePathname: PagePathname): ScriptPath
}

export interface PathFactory {
    (): PathAction
}
