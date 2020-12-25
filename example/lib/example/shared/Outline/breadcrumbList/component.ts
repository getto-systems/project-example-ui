import { LoadBreadcrumb } from "../../menu/action"

import { Breadcrumb } from "../../menu/data"

export interface BreadcrumbListComponentFactory {
    (material: BreadcrumbListMaterial): BreadcrumbListComponent
}
export type BreadcrumbListMaterial = Readonly<{
    loadBreadcrumb: LoadBreadcrumb
}>

export interface BreadcrumbListComponent {
    onStateChange(post: Post<BreadcrumbListState>): void
    load(): void
}

export type BreadcrumbListState =
    | Readonly<{ type: "initial-breadcrumb" }>
    | Readonly<{ type: "succeed-to-load"; breadcrumb: Breadcrumb }>

export const initialBreadcrumbListState: BreadcrumbListState = { type: "initial-breadcrumb" }

interface Post<T> {
    (state: T): void
}
