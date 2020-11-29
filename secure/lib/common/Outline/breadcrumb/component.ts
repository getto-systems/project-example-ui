import { LoadBreadcrumbAction } from "../../menu/action"

import { Breadcrumb } from "../../menu/data"

export interface BreadcrumbComponentFactory {
    (actions: BreadcrumbActionSet): BreadcrumbComponent
}
export type BreadcrumbActionSet = Readonly<{
    loadBreadcrumb: LoadBreadcrumbAction
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
