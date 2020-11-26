import { MenuActionSet, MenuComponent, MenuState } from "./component"

import { LoadMenuEvent, Menu, ToggleMenuExpandEvent } from "../../../menu/data"

export function initMenu(actions: MenuActionSet): MenuComponent {
    return new Component(actions)
}

class Component implements MenuComponent {
    actions: MenuActionSet

    listener: Post<MenuState>[] = []

    constructor(actions: MenuActionSet) {
        this.actions = actions
    }

    onStateChange(post: Post<MenuState>): void {
        this.listener.push(post)
    }
    post(state: MenuState): void {
        this.listener.forEach((post) => post(state))
    }

    load(): void {
        const nonce = this.actions.loadApiNonce()
        const roles = this.actions.loadApiRoles()
        this.actions.loadMenu(nonce, roles, (event) => {
            this.post(this.mapLoadMenuEvent(event))
        })
    }
    toggle(category: string[], menu: Menu): void {
        this.actions.toggleMenuExpand(category, menu, (event) => {
            this.post(this.mapToggleMenuExpandEvent(event))
        })
    }

    mapLoadMenuEvent(event: LoadMenuEvent): MenuState {
        return event
    }
    mapToggleMenuExpandEvent(event: ToggleMenuExpandEvent): MenuState {
        return event
    }
}

interface Post<T> {
    (state: T): void
}
