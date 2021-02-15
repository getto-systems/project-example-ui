import { ApplicationComponent } from "../../../../../vendor/getto-example/Application/component"

import { OutlineBreadcrumbListAction } from "../../../../../auth/permission/outline/action"

import { OutlineBreadcrumb } from "../../../../../auth/permission/outline/data"

export interface BreadcrumbListComponentFactory {
    (material: BreadcrumbListMaterial): BreadcrumbListComponent
}
export type BreadcrumbListMaterial = Readonly<{
    breadcrumbList: OutlineBreadcrumbListAction
}>

export interface BreadcrumbListComponent extends ApplicationComponent<BreadcrumbListComponentState> {
    load(): void
}

export type BreadcrumbListComponentState =
    | Readonly<{ type: "initial-breadcrumb-list" }>
    | Readonly<{ type: "succeed-to-load"; breadcrumb: OutlineBreadcrumb }>

export const initialBreadcrumbListComponentState: BreadcrumbListComponentState = {
    type: "initial-breadcrumb-list",
}
