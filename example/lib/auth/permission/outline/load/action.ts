import {
    LoadOutlineBreadcrumbListEvent,
    LoadOutlineMenuEvent,
    ToggleOutlineMenuExpandEvent,
} from "./event"

import { OutlineMenu, OutlineMenuCategoryPath, OutlineMenuTarget } from "./data"
import { LocationTypes } from "../../../../z_vendor/getto-application/location/detecter"

export type LoadOutlineAction = Readonly<{
    breadcrumbList: LoadOutlineBreadcrumbListAction
    menu: LoadOutlineMenuAction
}>

type LoadOutlineMenuLocationTypes = LocationTypes<Readonly<{ version: string }>, OutlineMenuTarget>
export type LoadOutlineMenuLocationDetecter = LoadOutlineMenuLocationTypes["detecter"]
export type LoadOutlineMenuLocationDetectMethod = LoadOutlineMenuLocationTypes["method"]
export type LoadOutlineMenuLocationInfo = LoadOutlineMenuLocationTypes["info"]
export type LoadOutlineMenuLocationKeys = LoadOutlineMenuLocationTypes["keys"]

export type LoadOutlineBreadcrumbListAction = Readonly<{
    loadBreadcrumbList: LoadOutlineBreadcrumbListMethod
}>

export type LoadOutlineMenuAction = Readonly<{
    loadMenu: LoadOutlineMenuMethod
    toggleMenuExpand: ToggleOutlineMenuExpandMethod
}>

export interface LoadOutlineBreadcrumbListPod {
    (detecter: LoadOutlineMenuLocationDetecter): LoadOutlineBreadcrumbListMethod
}
export interface LoadOutlineBreadcrumbListMethod {
    (post: Post<LoadOutlineBreadcrumbListEvent>): void
}

export interface LoadOutlineMenuPod {
    (detecter: LoadOutlineMenuLocationDetecter): LoadOutlineMenuMethod
}
export interface LoadOutlineMenuMethod {
    (post: Post<LoadOutlineMenuEvent>): void
}

export interface ToggleOutlineMenuExpandMethod {
    (
        menu: OutlineMenu,
        path: OutlineMenuCategoryPath,
        post: Post<ToggleOutlineMenuExpandEvent>,
    ): void
}

interface Post<T> {
    (event: T): void
}
