import { ApplicationComponent } from "../../../../../vendor/getto-example/Application/component"

import { BreadcrumbListAction } from "../../../../../auth/permission/menu/action"

import { Breadcrumb } from "../../../../../auth/permission/menu/data"

export interface BreadcrumbListComponentFactory {
    (material: BreadcrumbListMaterial): BreadcrumbListComponent
}
export type BreadcrumbListMaterial = Readonly<{
    breadcrumbList: BreadcrumbListAction
}>

export interface BreadcrumbListComponent extends ApplicationComponent<BreadcrumbListComponentState> {
    load(): void
}

export type BreadcrumbListComponentState =
    | Readonly<{ type: "initial-breadcrumb-list" }>
    | Readonly<{ type: "succeed-to-load"; breadcrumb: Breadcrumb }>

export const initialBreadcrumbListComponentState: BreadcrumbListComponentState = {
    type: "initial-breadcrumb-list",
}
