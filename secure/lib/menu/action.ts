import { LoadBreadcrumbEvent, LoadMenuEvent, Menu, MenuTarget, ToggleMenuExpandEvent } from "./data"
import { ApiNonce, ApiRoles, LoadResult } from "../credential/data"

export interface LoadBreadcrumb {
    (collector: LoadBreadcrumbCollector): LoadBreadcrumbAction
}
export interface LoadBreadcrumbAction {
    (post: Post<LoadBreadcrumbEvent>): void
}
export interface LoadBreadcrumbCollector {
    getMenuPath(): MenuTarget
}

export interface LoadMenu {
    (collector: LoadMenuCollector): LoadMenuAction
}
export interface LoadMenuAction {
    (nonce: LoadResult<ApiNonce>, roles: LoadResult<ApiRoles>, post: Post<LoadMenuEvent>): void
}
export interface LoadMenuCollector {
    getMenuPath(): MenuTarget
}

export interface ToggleMenuExpand {
    (): ToggleMenuExpandAction
}
export interface ToggleMenuExpandAction {
    (category: string[], menu: Menu, post: Post<ToggleMenuExpandEvent>): void
}

interface Post<T> {
    (event: T): void
}
