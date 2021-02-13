import { LoadMenuEvent, ToggleMenuExpandEvent } from "./event"

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
    (post: Post<LoadMenuEvent>): void
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
