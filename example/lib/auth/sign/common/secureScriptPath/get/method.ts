import { LocationTypes } from "../../../../../z_vendor/getto-application/location/detecter"
import { ConvertSecureScriptResult, LocationPathname } from "./data"

export interface GetSecureScriptPathPod {
    (info: GetSecureScriptPathLocationDetecter): GetSecureScriptPathMethod
}

type GetSecureScriptPathLocationTypes = LocationTypes<NoKeys, LocationPathname>
type NoKeys = {
    // no keys
}
export type GetSecureScriptPathLocationDetecter = GetSecureScriptPathLocationTypes["detecter"]
export type GetSecureScriptPathLocationMethod = GetSecureScriptPathLocationTypes["method"]
export type GetSecureScriptPathLocationInfo = GetSecureScriptPathLocationTypes["info"]

export interface GetSecureScriptPathMethod {
    (): ConvertSecureScriptResult
}
