import { LocationTypes } from "../../../z_vendor/getto-application/location/detecter"

import { MenuTargetPath } from "./data"

type LoadMenuLocationTypes = LocationTypes<Readonly<{ version: string }>, MenuTargetPath>
export type LoadMenuLocationDetecter = LoadMenuLocationTypes["detecter"]
export type LoadMenuLocationDetectMethod = LoadMenuLocationTypes["method"]
export type LoadMenuLocationInfo = LoadMenuLocationTypes["info"]
export type LoadMenuLocationKeys = LoadMenuLocationTypes["keys"]
