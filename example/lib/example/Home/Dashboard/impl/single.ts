import { DashboardCollectorSet, DashboardFactory, initDashboardComponent } from "./core"

import { DashboardEntryPoint } from "../view"

export function initDashboardAsSingle(
    factory: DashboardFactory,
    collector: DashboardCollectorSet
): DashboardEntryPoint {
    return {
        components: initDashboardComponent(factory, collector),
        terminate: () => {
            // worker とインターフェイスを合わせるために必要
        },
    }
}
