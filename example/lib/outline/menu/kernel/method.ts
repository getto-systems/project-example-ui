import { LocationTypes } from "../../../z_vendor/getto-application/location/infra"

import { MenuTargetPath } from "./data"

type LoadMenuLocationTypes = LocationTypes<MenuTargetPath>
export type LoadMenuLocationDetecter = LoadMenuLocationTypes["detecter"]
export type LoadMenuLocationDetectMethod = LoadMenuLocationTypes["method"]
export type LoadMenuLocationInfo = LoadMenuLocationTypes["info"]
export type LoadMenuLocationKeys = Readonly<{ version: string }>
