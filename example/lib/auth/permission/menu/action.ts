import { LoadMenuEvent, ToggleMenuExpandEvent } from "./event"

import { ApiNonce, ApiRoles, LoadApiCredentialResult } from "../../common/credential/data"
import { LoadBreadcrumbEvent, Menu, MenuCategoryPath, MenuTarget } from "./data"

export type MenuAction = Readonly<{
    loadBreadcrumb: LoadBreadcrumbPod
    loadMenu: LoadMenuPod
    toggleMenuExpand: ToggleMenuExpandPod
}>

export interface LoadBreadcrumbPod {
    (collector: LoadBreadcrumbCollector): LoadBreadcrumb
}
export interface LoadBreadcrumb {
    (post: Post<LoadBreadcrumbEvent>): void
}
export type LoadBreadcrumbCollector = MenuTargetCollector

export interface LoadMenuPod {
    (collector: LoadMenuCollector): LoadMenu
}
export interface LoadMenu {
    (nonce: LoadApiCredentialResult<ApiNonce>, roles: LoadApiCredentialResult<ApiRoles>, post: Post<LoadMenuEvent>): void
}
export type LoadMenuCollector = MenuTargetCollector

export interface MenuTargetCollector {
    getMenuTarget(): MenuTarget
}

export interface ToggleMenuExpandPod {
    (): ToggleMenuExpand
}
export interface ToggleMenuExpand {
    (menu: Menu, path: MenuCategoryPath, post: Post<ToggleMenuExpandEvent>): void
}

interface Post<T> {
    (event: T): void
}
