import { ApplicationAbstractAction } from "../../../../../z_getto/application/impl"

import {
    BreadcrumbListComponentFactory,
    BreadcrumbListMaterial,
    BreadcrumbListComponent,
    BreadcrumbListComponentState,
} from "./component"

export const initBreadcrumbListComponent: BreadcrumbListComponentFactory = (material) =>
    new Component(material)

class Component
    extends ApplicationAbstractAction<BreadcrumbListComponentState>
    implements BreadcrumbListComponent {
    material: BreadcrumbListMaterial

    constructor(material: BreadcrumbListMaterial) {
        super()
        this.material = material

        this.igniteHook(() => {
            this.material.breadcrumbList.loadBreadcrumbList((event) => {
                this.post(event)
            })
        })
    }
}
