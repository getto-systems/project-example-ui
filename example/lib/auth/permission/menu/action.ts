import { LoadMenuEvent, ToggleMenuExpandEvent } from "./event"

import { ApiNonce, ApiRoles, LoadApiCredentialResult } from "../../common/credential/data"
import { LoadBreadcrumbEvent, Menu, MenuCategoryPath, MenuTarget } from "./data"

export type MenuAction = Readonly<{
    loadBreadcrumb: LoadBreadcrumbPod
    loadMenu: LoadMenuPod
    toggleMenuExpand: ToggleMenuExpandPod
}>

export interface LoadBreadcrumbPod {
    (locationInfo: LoadBreadcrumbLocationInfo): LoadBreadcrumb
}
export interface LoadBreadcrumb {
    (post: Post<LoadBreadcrumbEvent>): void
}
export type LoadBreadcrumbLocationInfo = MenuLocationInfo

export interface LoadMenuPod {
    (locationInfo: LoadMenuLocationInfo): LoadMenu
}
export interface LoadMenu {
    (nonce: LoadApiCredentialResult<ApiNonce>, roles: LoadApiCredentialResult<ApiRoles>, post: Post<LoadMenuEvent>): void
}
export type LoadMenuLocationInfo = MenuLocationInfo

export interface MenuLocationInfo {
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
