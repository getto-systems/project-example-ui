import { ApplicationBaseComponent } from "../../../../sub/getto-example/x_components/Application/impl"

import {
    MenuListComponentFactory,
    MenuListMaterial,
    MenuListComponent,
    MenuListComponentState,
} from "./component"

import { Menu, MenuCategoryPath } from "../../../permission/menu/data"

export const initMenuListComponent: MenuListComponentFactory = (material) => new Component(material)

class Component extends ApplicationBaseComponent<MenuListComponentState> implements MenuListComponent {
    material: MenuListMaterial

    constructor(material: MenuListMaterial) {
        super()
        this.material = material
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
