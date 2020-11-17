import { DashboardResource } from "../../home/dashboard"

// TODO 実装する
import { newDashboardComponentSetFactory } from "../../y_mock/home/dashboard"

export function newDashboardComponentSetFactoryAsSingle(): Factory<DashboardResource> {
    return newDashboardComponentSetFactory()
}

interface Factory<T> {
    (): T
}
