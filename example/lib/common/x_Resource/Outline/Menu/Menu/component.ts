import { ApplicationStateAction } from "../../../../../z_vendor/getto-application/action/action"

import { LoadOutlineMenuAction } from "../../../../../auth/permission/outline/load/action"

import {
    OutlineMenu,
    OutlineMenuCategoryPath,
} from "../../../../../auth/permission/outline/load/data"
import {
    LoadOutlineMenuEvent,
    ToggleOutlineMenuExpandEvent,
} from "../../../../../auth/permission/outline/load/event"

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
    | LoadOutlineMenuEvent
    | ToggleOutlineMenuExpandEvent

export const initialMenuComponentState: MenuComponentState = { type: "initial-menu" }
