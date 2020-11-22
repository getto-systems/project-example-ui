import { PagePathname, ScriptPath } from "./data"

export interface SecureScriptPath {
    (collector: SecureScriptPathCollector): SecureScriptPathAction
}
export interface SecureScriptPathAction {
    (): ScriptPath
}
export interface SecureScriptPathCollector {
    getPagePathname(): PagePathname
}
