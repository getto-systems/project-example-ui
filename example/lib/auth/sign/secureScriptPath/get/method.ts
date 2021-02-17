import { LocationPathname, SecureScriptPath } from "./data"

export interface GetSecureScriptPathPod {
    (info: GetSecureScriptPathLocationInfo): GetSecureScriptPathMethod
}
export interface GetSecureScriptPathLocationInfo {
    getLocationPathname(): LocationPathname
}
export interface GetSecureScriptPathMethod {
    (): SecureScriptPath
}
