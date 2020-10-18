import { PagePathname, ScriptPath } from "./data"

export interface SecureScriptPathAction {
    (pagePathname: PagePathname): ScriptPath
}
