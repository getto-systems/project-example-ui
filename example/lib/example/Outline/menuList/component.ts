import { LoadApiNonce, LoadApiRoles } from "../../shared/credential/action"
import { LoadMenu, ToggleMenuExpandAction } from "../../shared/menu/action"

import { Menu, LoadMenuError } from "../../shared/menu/data"

export interface MenuListComponentFactory {
    (material: MenuListMaterial): MenuListComponent
}
export type MenuListMaterial = Readonly<{
    loadApiNonce: LoadApiNonce
    loadApiRoles: LoadApiRoles
    loadMenu: LoadMenu

    toggleMenuExpand: ToggleMenuExpandAction
}>

export interface MenuListComponent {
    onStateChange(post: Post<MenuListState>): void
    load(): void
    toggle(category: string[], menu: Menu): void
}

export type MenuListState =
    | Readonly<{ type: "initial-menu" }>
    | Readonly<{ type: "succeed-to-load"; menu: Menu }>
    | Readonly<{ type: "failed-to-load"; menu: Menu; err: LoadMenuError }>
    | Readonly<{ type: "succeed-to-toggle"; menu: Menu }>
    | Readonly<{ type: "failed-to-toggle"; menu: Menu; err: LoadMenuError }>

export const initialMenuListState: MenuListState = { type: "initial-menu" }

interface Post<T> {
    (state: T): void
}
