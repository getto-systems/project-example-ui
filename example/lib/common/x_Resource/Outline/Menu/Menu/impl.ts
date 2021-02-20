import { ApplicationAbstractAction } from "../../../../../z_getto/application/impl"

import { MenuComponentFactory, MenuMaterial, MenuComponent, MenuComponentState } from "./component"

import {
    OutlineMenu,
    OutlineMenuCategoryPath,
} from "../../../../../auth/permission/outline/load/data"

export const initMenuComponent: MenuComponentFactory = (material) => new Component(material)

class Component extends ApplicationAbstractAction<MenuComponentState> implements MenuComponent {
    material: MenuMaterial

    constructor(material: MenuMaterial) {
        super()
        this.material = material

        this.igniteHook(() => {
            this.material.menu.loadMenu(this.post)
        })
    }

    toggle(menu: OutlineMenu, path: OutlineMenuCategoryPath): void {
        this.material.menu.toggleMenuExpand(menu, path, this.post)
    }
}
