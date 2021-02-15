import { ApplicationComponent } from "../../../../../vendor/getto-example/Application/component"

import { MenuAction } from "../../../../../auth/permission/outline/action"

import { Menu, LoadMenuError, MenuCategoryPath } from "../../../../../auth/permission/outline/data"

export interface MenuComponentFactory {
    (material: MenuMaterial): MenuComponent
}
export type MenuMaterial = Readonly<{
    menu: MenuAction
}>

export interface MenuComponent extends ApplicationComponent<MenuComponentState> {
    load(): void
    toggle(menu: Menu, path: MenuCategoryPath): void
}

export type MenuComponentState =
    | Readonly<{ type: "initial-menu" }>
    | Readonly<{ type: "succeed-to-instant-load"; menu: Menu }>
    | Readonly<{ type: "succeed-to-load"; menu: Menu }>
    | Readonly<{ type: "failed-to-load"; menu: Menu; err: LoadMenuError }>
    | Readonly<{ type: "succeed-to-toggle"; menu: Menu }>
    | Readonly<{ type: "failed-to-toggle"; menu: Menu; err: LoadMenuError }>

export const initialMenuComponentState: MenuComponentState = { type: "initial-menu" }
