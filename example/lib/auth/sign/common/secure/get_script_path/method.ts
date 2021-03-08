import { LocationTypes } from "../../../../../z_vendor/getto-application/location/detecter"
import { ConvertScriptPathResult, LocationPathname } from "./data"

export interface GetScriptPathPod {
    (info: GetScriptPathLocationDetecter): GetScriptPathMethod
}

type GetScriptPathLocationTypes = LocationTypes<NoKeys, LocationPathname>
type NoKeys = {
    // no keys
}
export type GetScriptPathLocationDetecter = GetScriptPathLocationTypes["detecter"]
export type GetScriptPathLocationMethod = GetScriptPathLocationTypes["method"]
export type GetScriptPathLocationInfo = GetScriptPathLocationTypes["info"]

export interface GetScriptPathMethod {
    (): ConvertScriptPathResult
}
