import { LoadBreadcrumbListEvent, LoadMenuEvent, ToggleMenuExpandEvent } from "./event"

import { Menu, MenuCategoryPath, MenuTarget } from "./data"

export type OutlineAction = Readonly<{
    breadcrumbList: BreadcrumbListAction
    menu: MenuAction
}>

export type BreadcrumbListAction = Readonly<{
    loadBreadcrumbList: LoadBreadcrumbListMethod
}>

export type BreadcrumbListActionLocationInfo = LoadMenuLocationInfo

export type MenuAction = Readonly<{
    loadMenu: LoadMenuMethod
    toggleMenuExpand: ToggleMenuExpandMethod
}>

export type MenuActionLocationInfo = LoadMenuLocationInfo

export interface LoadBreadcrumbListPod {
    (locationInfo: LoadBreadcrumbListLocationInfo): LoadBreadcrumbListMethod
}
export type LoadBreadcrumbListLocationInfo = LoadMenuLocationInfo
export interface LoadBreadcrumbListMethod {
    (post: Post<LoadBreadcrumbListEvent>): void
}

export interface LoadMenuPod {
    (locationInfo: LoadMenuLocationInfo): LoadMenuMethod
}
export type LoadMenuLocationInfo = {
    getMenuTarget(): MenuTarget
}
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
