import { PagePathname, ScriptPath } from "./data"

export interface ApplicationAction {
    secureScriptPath(pagePathname: PagePathname): ScriptPath
}
