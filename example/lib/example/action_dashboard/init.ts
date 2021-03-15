import { newBaseResource } from "../action_base/init"

import { DashboardView } from "./resource"
import { initDashboardView } from "./impl"

type OutsideFeature = Readonly<{
    webStorage: Storage
    currentLocation: Location
}>
export function newDashboardView(feature: OutsideFeature): DashboardView {
    return initDashboardView(newBaseResource(feature))
}
