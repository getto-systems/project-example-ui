import { DashboardCollectorSet, DashboardFactorySet, initDashboardComponentSet } from "./core"

import { DashboardResource } from "../view"

export function initDashboardAsSingle(
    factory: DashboardFactorySet,
    collector: DashboardCollectorSet
): DashboardResource {
    return {
        components: initDashboardComponentSet(factory, collector),
        terminate: () => {
            // worker とインターフェイスを合わせるために必要
        },
    }
}
