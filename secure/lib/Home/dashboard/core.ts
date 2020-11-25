import { DashboardResource } from "../dashboard"

// TODO 実装する
import { newDashboardComponentSetFactory } from "./mock"

export function newDashboardComponentSetFactoryAsSingle(): Factory<DashboardResource> {
    return newDashboardComponentSetFactory()
}

interface Factory<T> {
    (): T
}
