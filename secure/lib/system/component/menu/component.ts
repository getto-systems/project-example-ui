import { LoadMenuAction } from "../../../menu/action"

import { Menu, LoadMenuError } from "../../../menu/data"

export interface MenuComponentFactory {
    (actions: MenuActionSet): MenuComponent
}
export type MenuActionSet = Readonly<{
    load: LoadMenuAction
}>

export interface MenuComponent {
    onStateChange(post: Post<MenuState>): void
    load(): void
}

export type MenuState =
    | Readonly<{ type: "initial-menu" }>
    | Readonly<{ type: "succeed-to-load"; menu: Menu }>
    | Readonly<{ type: "failed-to-load"; menu: Menu; err: LoadMenuError }>

export const initialMenuState: MenuState = { type: "initial-menu" }

interface Post<T> {
    (state: T): void
}
