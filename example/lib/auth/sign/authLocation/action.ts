import { LocationPathname, SecureScriptPath } from "./data"

export type AuthLocationAction = Readonly<{
    getSecureScriptPath: GetSecureScriptPathMethod
}>
export type AuthLocationActionLocationInfo = GetSecureScriptPathLocationInfo

export interface GetSecureScriptPathPod {
    (info: GetSecureScriptPathLocationInfo): GetSecureScriptPathMethod
}
export interface GetSecureScriptPathLocationInfo {
    getLocationPathname(): LocationPathname
}
export interface GetSecureScriptPathMethod {
    (): SecureScriptPath
}
