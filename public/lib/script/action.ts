import { PagePathname, ScriptPath } from "./data"

export interface ScriptAction {
    secureScriptPath(pagePathname: PagePathname): ScriptPath
}
