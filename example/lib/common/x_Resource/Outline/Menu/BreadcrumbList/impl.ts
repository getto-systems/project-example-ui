import { ApplicationAbstractStateAction } from "../../../../../z_getto/action/impl"

import {
    BreadcrumbListComponentFactory,
    BreadcrumbListMaterial,
    BreadcrumbListComponent,
    BreadcrumbListComponentState,
} from "./component"

export const initBreadcrumbListComponent: BreadcrumbListComponentFactory = (material) =>
    new Component(material)

class Component
    extends ApplicationAbstractStateAction<BreadcrumbListComponentState>
    implements BreadcrumbListComponent {
    readonly initialState: BreadcrumbListComponentState = { type: "initial-breadcrumb-list" }
    
    material: BreadcrumbListMaterial

    constructor(material: BreadcrumbListMaterial) {
        super()
        this.material = material

        this.igniteHook(() => {
            this.material.breadcrumbList.loadBreadcrumbList(this.post)
        })
    }
}
