import { ApplicationAbstractStateAction } from "../../../../../z_vendor/getto-application/action/impl"

import { MenuComponentFactory, MenuMaterial, MenuComponent, MenuComponentState } from "./component"

import {
    OutlineMenu,
    OutlineMenuCategoryPath,
} from "../../../../../auth/permission/outline/load/data"

export const initMenuComponent: MenuComponentFactory = (material) => new Component(material)

class Component
    extends ApplicationAbstractStateAction<MenuComponentState>
    implements MenuComponent {
    readonly initialState: MenuComponentState = { type: "initial-menu" }

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
