import { PagePathname, ScriptPath } from "./data"

export type ApplicationAction = Readonly<{
    secureScriptPath: SecureScriptPathPod
}>
export type ApplicationCollector = SecureScriptPathCollector

export interface SecureScriptPathPod {
    (collector: SecureScriptPathCollector): SecureScriptPath
}
export interface SecureScriptPath {
    (): ScriptPath
}
export interface SecureScriptPathCollector {
    getPagePathname(): PagePathname
}
