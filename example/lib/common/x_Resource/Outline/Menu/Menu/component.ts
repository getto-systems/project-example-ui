import { ApplicationStateAction } from "../../../../../z_getto/application/action"

import { LoadOutlineMenuAction } from "../../../../../auth/permission/outline/load/action"

import { OutlineMenu, LoadOutlineMenuBadgeError, OutlineMenuCategoryPath } from "../../../../../auth/permission/outline/load/data"

export interface MenuComponentFactory {
    (material: MenuMaterial): MenuComponent
}
export type MenuMaterial = Readonly<{
    menu: LoadOutlineMenuAction
}>

export interface MenuComponent extends ApplicationStateAction<MenuComponentState> {
    toggle(menu: OutlineMenu, path: OutlineMenuCategoryPath): void
}

export type MenuComponentState =
    | Readonly<{ type: "initial-menu" }>
    | Readonly<{ type: "succeed-to-instant-load"; menu: OutlineMenu }>
    | Readonly<{ type: "succeed-to-load"; menu: OutlineMenu }>
    | Readonly<{ type: "failed-to-load"; menu: OutlineMenu; err: LoadOutlineMenuBadgeError }>
    | Readonly<{ type: "succeed-to-toggle"; menu: OutlineMenu }>
    | Readonly<{ type: "failed-to-toggle"; menu: OutlineMenu; err: LoadOutlineMenuBadgeError }>

export const initialMenuComponentState: MenuComponentState = { type: "initial-menu" }
