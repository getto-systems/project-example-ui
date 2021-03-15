import { newBaseResource } from "../action_base/init"

import { DashboardEntryPoint } from "./entry_point"
import { initDashboardEntryPoint } from "./impl"

type OutsideFeature = Readonly<{
    webStorage: Storage
    currentLocation: Location
}>
export function newDashboardEntryPoint(feature: OutsideFeature): DashboardEntryPoint {
    return initDashboardEntryPoint(newBaseResource(feature))
}
