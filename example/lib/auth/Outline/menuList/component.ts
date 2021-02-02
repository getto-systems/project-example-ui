import { ApplicationComponent } from "../../../sub/getto-example/application/component"

import { LoadApiNonce, LoadApiRoles } from "../../common/credential/action"
import { LoadMenu, ToggleMenuExpand } from "../../permission/menu/action"

import { Menu, LoadMenuError, MenuCategoryPath } from "../../permission/menu/data"

export interface MenuListComponentFactory {
    (material: MenuListMaterial): MenuListComponent
}
export type MenuListMaterial = Readonly<{
    loadApiNonce: LoadApiNonce
    loadApiRoles: LoadApiRoles
    loadMenu: LoadMenu

    toggleMenuExpand: ToggleMenuExpand
}>

export interface MenuListComponent extends ApplicationComponent<MenuListState> {
    load(): void
    toggle(menu: Menu, path: MenuCategoryPath): void
}

export type MenuListState =
    | Readonly<{ type: "initial-menu-list" }>
    | Readonly<{ type: "succeed-to-instant-load"; menu: Menu }>
    | Readonly<{ type: "succeed-to-load"; menu: Menu }>
    | Readonly<{ type: "failed-to-load"; menu: Menu; err: LoadMenuError }>
    | Readonly<{ type: "succeed-to-toggle"; menu: Menu }>
    | Readonly<{ type: "failed-to-toggle"; menu: Menu; err: LoadMenuError }>

export const initialMenuListState: MenuListState = { type: "initial-menu-list" }
