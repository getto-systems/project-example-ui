import {
    MenuListComponentFactory,
    MenuListMaterial,
    MenuListComponent,
    MenuListState,
} from "./component"

import { Menu, MenuCategoryPath } from "../../permission/menu/data"

export const initMenuListComponent: MenuListComponentFactory = (material) => new Component(material)

class Component implements MenuListComponent {
    material: MenuListMaterial

    listener: Post<MenuListState>[] = []

    constructor(material: MenuListMaterial) {
        this.material = material
    }

    onStateChange(post: Post<MenuListState>): void {
        this.listener.push(post)
    }
    post(state: MenuListState): void {
        this.listener.forEach((post) => post(state))
    }

    load(): void {
        const nonce = this.material.loadApiNonce()
        const roles = this.material.loadApiRoles()
        this.material.loadMenu(nonce, roles, (event) => {
            this.post(event)
        })
    }
    toggle(menu: Menu, path: MenuCategoryPath): void {
        this.material.toggleMenuExpand(menu, path, (event) => {
            this.post(event)
        })
    }
}

interface Post<T> {
    (state: T): void
}
