import { PagePathname, ScriptPath } from "./data"

export type LocationActionPod = Readonly<{
    initGetSecureScriptPath: GetSecureScriptPathPod
}>
export type LocationAction = Readonly<{
    getSecureScriptPath: GetSecureScriptPathMethod
}>
export type LocationActionLocationInfo = GetSecureScriptPathLocationInfo

export interface GetSecureScriptPathPod {
    (info: GetSecureScriptPathLocationInfo): GetSecureScriptPathMethod
}
export interface GetSecureScriptPathLocationInfo {
    getPagePathname(): PagePathname
}
export interface GetSecureScriptPathMethod {
    (): ScriptPath
}
