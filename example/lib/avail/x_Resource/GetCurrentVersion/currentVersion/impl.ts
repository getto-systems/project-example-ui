import { ApplicationAbstractStateAction } from "../../../../z_vendor/getto-application/action/impl"

import {
    CurrentVersionMaterial,
    CurrentVersionComponent,
    CurrentVersionComponentState,
    CurrentVersionComponentFactory,
} from "./component"

export const initCurrentVersionComponent: CurrentVersionComponentFactory = (material) =>
    new Component(material)

class Component
    extends ApplicationAbstractStateAction<CurrentVersionComponentState>
    implements CurrentVersionComponent {
    readonly initialState: CurrentVersionComponentState = { type: "initial-current-version" }

    material: CurrentVersionMaterial

    constructor(material: CurrentVersionMaterial) {
        super()
        this.material = material

        this.igniteHook(() => {
            this.material.findCurrentVersion(this.post)
        })
    }
}
