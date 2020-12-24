import { LoadBreadcrumb } from "../../menu/action"

import { Breadcrumb } from "../../menu/data"

export interface BreadcrumbComponentFactory {
    (material: BreadcrumbMaterial): BreadcrumbComponent
}
export type BreadcrumbMaterial = Readonly<{
    loadBreadcrumb: LoadBreadcrumb
}>

export interface BreadcrumbComponent {
    onStateChange(post: Post<BreadcrumbState>): void
    load(): void
}

export type BreadcrumbState =
    | Readonly<{ type: "initial-breadcrumb" }>
    | Readonly<{ type: "succeed-to-load"; breadcrumb: Breadcrumb }>

export const initialBreadcrumbState: BreadcrumbState = { type: "initial-breadcrumb" }

interface Post<T> {
    (state: T): void
}
