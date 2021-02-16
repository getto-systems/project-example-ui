import {
    LoadOutlineBreadcrumbListEvent,
    LoadOutlineMenuEvent,
    ToggleOutlineMenuExpandEvent,
} from "./event"

import { OutlineMenu, OutlineMenuCategoryPath, OutlineMenuTarget } from "./data"

export type LoadOutlineAction = Readonly<{
    breadcrumbList: LoadOutlineBreadcrumbListAction
    menu: LoadOutlineMenuAction
}>
export type LoadOutlineActionLocationInfo = {
    getOutlineMenuTarget(): OutlineMenuTarget
}

export type LoadOutlineBreadcrumbListAction = Readonly<{
    loadBreadcrumbList: LoadOutlineBreadcrumbListMethod
}>

export type LoadOutlineMenuAction = Readonly<{
    loadMenu: LoadOutlineMenuMethod
    toggleMenuExpand: ToggleOutlineMenuExpandMethod
}>

export interface LoadOutlineBreadcrumbListPod {
    (locationInfo: LoadOutlineActionLocationInfo): LoadOutlineBreadcrumbListMethod
}
export interface LoadOutlineBreadcrumbListMethod {
    (post: Post<LoadOutlineBreadcrumbListEvent>): void
}

export interface LoadOutlineMenuPod {
    (locationInfo: LoadOutlineActionLocationInfo): LoadOutlineMenuMethod
}
export interface LoadOutlineMenuMethod {
    (post: Post<LoadOutlineMenuEvent>): void
}

export interface ToggleOutlineMenuExpandMethod {
    (menu: OutlineMenu, path: OutlineMenuCategoryPath, post: Post<ToggleOutlineMenuExpandEvent>): void
}

interface Post<T> {
    (event: T): void
}
