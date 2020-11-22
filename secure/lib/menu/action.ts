import { LoadBreadcrumbEvent, LoadMenuEvent, MenuPathInfo } from "./data"
import { ApiNonce, ApiRoles } from "../credential/data"

export interface LoadBreadcrumb {
    (collector: LoadBreadcrumbCollector): LoadBreadcrumbAction
}
export interface LoadBreadcrumbAction {
    (post: Post<LoadBreadcrumbEvent>): void
}
export interface LoadBreadcrumbCollector {
    getMenuPathInfo(): MenuPathInfo
}

export interface LoadMenu {
    (collector: LoadMenuCollector): LoadMenuAction
}
export interface LoadMenuAction {
    (post: Post<LoadMenuEvent>): void
}
export interface LoadMenuCollector {
    getApiNonce(): Promise<ApiNonce>
    getApiRoles(): Promise<ApiRoles>
    getMenuPathInfo(): MenuPathInfo
}

interface Post<T> {
    (event: T): void
}
