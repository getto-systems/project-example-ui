import { LocationPathname, SecureScriptPath } from "./data"

export type GetSecureScriptPathAction = Readonly<{
    get: GetSecureScriptPathMethod
}>
export type GetSecureScriptPathActionLocationInfo = GetSecureScriptPathLocationInfo

export interface GetSecureScriptPathPod {
    (info: GetSecureScriptPathLocationInfo): GetSecureScriptPathMethod
}
export interface GetSecureScriptPathLocationInfo {
    getLocationPathname(): LocationPathname
}
export interface GetSecureScriptPathMethod {
    (): SecureScriptPath
}
