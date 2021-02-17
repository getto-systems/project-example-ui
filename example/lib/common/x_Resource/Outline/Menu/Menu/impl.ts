import { ApplicationAbstractAction } from "../../../../vendor/getto-example/Application/impl"

import {
    MenuComponentFactory,
    MenuMaterial,
    MenuComponent,
    MenuComponentState,
} from "./component"

import { OutlineMenu, OutlineMenuCategoryPath } from "../../../../../auth/permission/outline/load/data"

export const initMenuComponent: MenuComponentFactory = (material) => new Component(material)

class Component extends ApplicationAbstractAction<MenuComponentState> implements MenuComponent {
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
    toggle(menu: OutlineMenu, path: OutlineMenuCategoryPath): void {
        this.material.menu.toggleMenuExpand(menu, path, (event) => {
            this.post(event)
        })
    }
}
