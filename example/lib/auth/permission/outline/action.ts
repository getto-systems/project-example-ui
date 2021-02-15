import { LoadBreadcrumbListEvent, LoadMenuEvent, ToggleMenuExpandEvent } from "./event"

import { Menu, MenuCategoryPath, MenuTarget } from "./data"

export type OutlineAction = Readonly<{
    breadcrumbList: BreadcrumbListAction
    menu: MenuAction
}>
export type OutlineActionLocationInfo = {
    getMenuTarget(): MenuTarget
}

export type BreadcrumbListAction = Readonly<{
    loadBreadcrumbList: LoadBreadcrumbListMethod
}>

export type MenuAction = Readonly<{
    loadMenu: LoadMenuMethod
    toggleMenuExpand: ToggleMenuExpandMethod
}>

export interface LoadBreadcrumbListPod {
    (locationInfo: LoadBreadcrumbListLocationInfo): LoadBreadcrumbListMethod
}
export type LoadBreadcrumbListLocationInfo = OutlineActionLocationInfo
export interface LoadBreadcrumbListMethod {
    (post: Post<LoadBreadcrumbListEvent>): void
}

export interface LoadMenuPod {
    (locationInfo: LoadMenuLocationInfo): LoadMenuMethod
}
export type LoadMenuLocationInfo = OutlineActionLocationInfo
export interface LoadMenuMethod {
    (post: Post<LoadMenuEvent>): void
}

export interface ToggleMenuExpandPod {
    (): ToggleMenuExpandMethod
}
export interface ToggleMenuExpandMethod {
    (menu: Menu, path: MenuCategoryPath, post: Post<ToggleMenuExpandEvent>): void
}

interface Post<T> {
    (event: T): void
}
