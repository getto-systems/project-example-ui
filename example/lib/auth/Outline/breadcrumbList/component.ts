import { ApplicationComponent } from "../../../sub/getto-example/application/component"

import { LoadBreadcrumb } from "../../permission/menu/action"

import { Breadcrumb } from "../../permission/menu/data"

export interface BreadcrumbListComponentFactory {
    (material: BreadcrumbListMaterial): BreadcrumbListComponent
}
export type BreadcrumbListMaterial = Readonly<{
    loadBreadcrumb: LoadBreadcrumb
}>

export interface BreadcrumbListComponent extends ApplicationComponent<BreadcrumbListState> {
    load(): void
}

export type BreadcrumbListState =
    | Readonly<{ type: "initial-breadcrumb-list" }>
    | Readonly<{ type: "succeed-to-load"; breadcrumb: Breadcrumb }>

export const initialBreadcrumbListState: BreadcrumbListState = { type: "initial-breadcrumb-list" }
