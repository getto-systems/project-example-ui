import { LoadBreadcrumbEvent, LoadMenuEvent, MenuTarget } from "./data"
import { ApiNonce, ApiRoles } from "../credential/data"

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
    (nonce: ApiNonce, roles: ApiRoles, post: Post<LoadMenuEvent>): void
}
export interface LoadMenuCollector {
    getMenuPath(): MenuTarget
}

interface Post<T> {
    (event: T): void
}
