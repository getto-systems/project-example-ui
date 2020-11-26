import { DashboardFactory } from "../view"

import { DashboardCollectorSet, DashboardFactorySet, initDashboardComponentSet } from "./core"

export type FactorySet = DashboardFactorySet
export type CollectorSet = DashboardCollectorSet

export function initDashboardFactoryAsSingle(
    factory: FactorySet,
    collector: CollectorSet
): DashboardFactory {
    return () => {
        return {
            components: initDashboardComponentSet(factory, collector),
            terminate: () => {
                // worker とインターフェイスを合わせるために必要
            },
        }
    }
}
