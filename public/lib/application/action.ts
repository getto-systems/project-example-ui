import { PagePathname, ScriptPath } from "./data"

export interface SecureScriptPath {
    (): SecureScriptPathAction
}
export interface SecureScriptPathAction {
    (pagePathname: PagePathname): ScriptPath
}
