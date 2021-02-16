import { LocationPathname, SecureScriptPath } from "./data"

export type GetSecureScriptPathAction_legacy = Readonly<{
    get: GetSecureScriptPathMethod
}>
export type GetSecureScriptPathActionLocationInfo_legacy = GetSecureScriptPathLocationInfo

export interface GetSecureScriptPathPod {
    (info: GetSecureScriptPathLocationInfo): GetSecureScriptPathMethod
}
export interface GetSecureScriptPathLocationInfo {
    getLocationPathname(): LocationPathname
}
export interface GetSecureScriptPathMethod {
    (): SecureScriptPath
}
