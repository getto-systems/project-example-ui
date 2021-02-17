import { ApplicationAbstractAction } from "../../../../vendor/getto-example/Application/impl"

import {
    BreadcrumbListComponentFactory,
    BreadcrumbListMaterial,
    BreadcrumbListComponent,
    BreadcrumbListComponentState,
} from "./component"

export const initBreadcrumbListComponent: BreadcrumbListComponentFactory = (material) =>
    new Component(material)

class Component extends ApplicationAbstractAction<BreadcrumbListComponentState> implements BreadcrumbListComponent {
    material: BreadcrumbListMaterial

    constructor(material: BreadcrumbListMaterial) {
        super()
        this.material = material
    }

    load(): void {
        this.material.breadcrumbList.loadBreadcrumbList((event) => {
            this.post(event)
        })
    }
}