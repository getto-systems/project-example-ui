import { LoadApiNonceAction, LoadApiRolesAction } from "../../../credential/action"
import { LoadMenuAction, ToggleMenuExpandAction } from "../../../menu/action"

import { Menu, LoadMenuError } from "../../../menu/data"

export interface MenuComponentFactory {
    (actions: MenuActionSet): MenuComponent
}
export type MenuActionSet = Readonly<{
    loadApiNonce: LoadApiNonceAction
    loadApiRoles: LoadApiRolesAction
    loadMenu: LoadMenuAction

    toggleMenuExpand: ToggleMenuExpandAction
}>

export interface MenuComponent {
    onStateChange(post: Post<MenuState>): void
    load(): void
    toggle(category: string[], menu: Menu): void
}

export type MenuState =
    | Readonly<{ type: "initial-menu" }>
    | Readonly<{ type: "succeed-to-load"; menu: Menu }>
    | Readonly<{ type: "failed-to-load"; menu: Menu; err: LoadMenuError }>
    | Readonly<{ type: "succeed-to-toggle"; menu: Menu }>
    | Readonly<{ type: "failed-to-toggle"; menu: Menu; err: LoadMenuError }>

export const initialMenuState: MenuState = { type: "initial-menu" }

interface Post<T> {
    (state: T): void
}
