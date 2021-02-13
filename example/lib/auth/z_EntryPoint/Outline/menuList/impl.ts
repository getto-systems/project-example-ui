import { ApplicationBaseComponent } from "../../../../common/getto-example/Application/impl"

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
        this.material.loadMenu((event) => {
            this.post(event)
        })
    }
    toggle(menu: Menu, path: MenuCategoryPath): void {
        this.material.toggleMenuExpand(menu, path, (event) => {
            this.post(event)
        })
    }
}
