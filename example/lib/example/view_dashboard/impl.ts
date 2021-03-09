import { DashboardEntryPoint, DashboardResource } from "./entry_point"

export function initDashboardEntryPoint(resource: DashboardResource): DashboardEntryPoint {
    return {
        resource,
        terminate: () => {
            resource.menu.terminate()
        },
    }
}
