import { MenuMaterial, MenuComponent, MenuState } from "./component"

import { Menu } from "../../menu/data"

export function initMenu(material: MenuMaterial): MenuComponent {
    return new Component(material)
}

class Component implements MenuComponent {
    material: MenuMaterial

    listener: Post<MenuState>[] = []

    constructor(material: MenuMaterial) {
        this.material = material
    }

    onStateChange(post: Post<MenuState>): void {
        this.listener.push(post)
    }
    post(state: MenuState): void {
        this.listener.forEach((post) => post(state))
    }

    load(): void {
        const nonce = this.material.loadApiNonce()
        const roles = this.material.loadApiRoles()
        this.material.loadMenu(nonce, roles, (event) => {
            this.post(event)
        })
    }
    toggle(category: string[], menu: Menu): void {
        this.material.toggleMenuExpand(category, menu, (event) => {
            this.post(event)
        })
    }
}

interface Post<T> {
    (state: T): void
}
