import { LoadBreadcrumbAction } from "../../../menu/action"

import { Breadcrumb } from "../../../menu/data"

export interface BreadcrumbComponentFactory {
    (actions: BreadcrumbActionSet): BreadcrumbComponent
}
export type BreadcrumbActionSet = Readonly<{
    load: LoadBreadcrumbAction
}>

export interface BreadcrumbComponent {
    onStateChange(post: Post<BreadcrumbState>): void
    action(request: BreadcrumbRequest): void
}

export type BreadcrumbState =
    | Readonly<{ type: "initial-breadcrumb" }>
    | Readonly<{ type: "succeed-to-load"; breadcrumb: Breadcrumb }>

export const initialBreadcrumbState: BreadcrumbState = { type: "initial-breadcrumb" }

export type BreadcrumbRequest = Readonly<{ type: "load-breadcrumb" }>

interface Post<T> {
    (state: T): void
}
