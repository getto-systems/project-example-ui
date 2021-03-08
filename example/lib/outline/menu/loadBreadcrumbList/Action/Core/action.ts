import { LoadBreadcrumbListMethod } from "../../method"

import { BreadcrumbList } from "../../data"

export interface LoadBreadcrumbListCoreAction {
    load(): BreadcrumbList
}

export type LoadBreadcrumbListCoreMaterial = Readonly<{
    load: LoadBreadcrumbListMethod
}>
