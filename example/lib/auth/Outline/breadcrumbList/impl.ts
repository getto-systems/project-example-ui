import { ApplicationBaseComponent } from "../../../sub/getto-example/application/impl"

import {
    BreadcrumbListComponentFactory,
    BreadcrumbListMaterial,
    BreadcrumbListComponent,
    BreadcrumbListState,
} from "./component"

export const initBreadcrumbListComponent: BreadcrumbListComponentFactory = (material) =>
    new Component(material)

class Component extends ApplicationBaseComponent<BreadcrumbListState> implements BreadcrumbListComponent {
    material: BreadcrumbListMaterial

    constructor(material: BreadcrumbListMaterial) {
        super()
        this.material = material
    }

    load(): void {
        this.material.loadBreadcrumb((event) => {
            this.post(event)
        })
    }
}
