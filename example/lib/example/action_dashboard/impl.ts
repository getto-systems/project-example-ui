import { initBaseEntryPoint } from "../action_base/impl"

import { DashboardEntryPoint, DashboardResource } from "./entry_point"

export function initDashboardEntryPoint(resource: DashboardResource): DashboardEntryPoint {
    return initBaseEntryPoint(resource, () => null)
}
