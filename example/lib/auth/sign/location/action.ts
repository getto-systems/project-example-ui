import { PagePathname, ScriptPath } from "./data"

export type ApplicationAction = Readonly<{
    secureScriptPath: SecureScriptPathPod
}>

export interface SecureScriptPathPod {
    (info: SecureScriptPathLocationInfo): SecureScriptPath
}
export interface SecureScriptPath {
    (): ScriptPath
}
export interface SecureScriptPathLocationInfo {
    getPagePathname(): PagePathname
}
