import { LoadOutlineBreadcrumbListEvent, LoadOutlineMenuEvent, ToggleOutlineMenuExpandEvent } from "./event"

import { OutlineMenu, OutlineMenuCategoryPath, OutlineMenuTarget } from "./data"

export type OutlineAction = Readonly<{
    breadcrumbList: OutlineBreadcrumbListAction
    menu: OutlineMenuAction
}>
export type OutlineActionLocationInfo = {
    getOutlineMenuTarget(): OutlineMenuTarget
}

export type OutlineBreadcrumbListAction = Readonly<{
    loadBreadcrumbList: LoadBreadcrumbListMethod
}>

export type OutlineMenuAction = Readonly<{
    loadMenu: LoadOutlineMenuMethod
    toggleMenuExpand: ToggleOutlineMenuExpandMethod
}>

export interface LoadOutlineBreadcrumbListPod {
    (locationInfo: OutlineActionLocationInfo): LoadBreadcrumbListMethod
}
export interface LoadBreadcrumbListMethod {
    (post: Post<LoadOutlineBreadcrumbListEvent>): void
}

export interface LoadOutlineMenuPod {
    (locationInfo: OutlineActionLocationInfo): LoadOutlineMenuMethod
}
export interface LoadOutlineMenuMethod {
    (post: Post<LoadOutlineMenuEvent>): void
}

export interface ToggleOutlineMenuExpandPod {
    (): ToggleOutlineMenuExpandMethod
}
export interface ToggleOutlineMenuExpandMethod {
    (menu: OutlineMenu, path: OutlineMenuCategoryPath, post: Post<ToggleOutlineMenuExpandEvent>): void
}

interface Post<T> {
    (event: T): void
}
