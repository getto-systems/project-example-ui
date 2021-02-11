import { ApplicationBaseComponent } from "../../../../sub/getto-example/x_components/Application/impl"

import {
    BreadcrumbListComponentFactory,
    BreadcrumbListMaterial,
    BreadcrumbListComponent,
    BreadcrumbListComponentState,
} from "./component"

export const initBreadcrumbListComponent: BreadcrumbListComponentFactory = (material) =>
    new Component(material)

class Component extends ApplicationBaseComponent<BreadcrumbListComponentState> implements BreadcrumbListComponent {
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
