import { ApplicationBaseComponent } from "../../../../../vendor/getto-example/Application/impl"

import {
    MenuComponentFactory,
    MenuMaterial,
    MenuComponent,
    MenuComponentState,
} from "./component"

import { Menu, MenuCategoryPath } from "../../../../../auth/permission/menu/data"

export const initMenuComponent: MenuComponentFactory = (material) => new Component(material)

class Component extends ApplicationBaseComponent<MenuComponentState> implements MenuComponent {
    material: MenuMaterial

    constructor(material: MenuMaterial) {
        super()
        this.material = material
    }

    load(): void {
        this.material.menu.loadMenu((event) => {
            this.post(event)
        })
    }
    toggle(menu: Menu, path: MenuCategoryPath): void {
        this.material.menu.toggleMenuExpand(menu, path, (event) => {
            this.post(event)
        })
    }
}
