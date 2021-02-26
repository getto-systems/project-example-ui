import { ApplicationAbstractStateAction } from "../../../../z_vendor/getto-application/action/impl"

import {
    NextVersionComponentFactory,
    NextVersionMaterial,
    NextVersionComponent,
    NextVersionComponentState,
} from "./component"

export const initNextVersionComponent: NextVersionComponentFactory = (material) =>
    new Component(material)

class Component
    extends ApplicationAbstractStateAction<NextVersionComponentState>
    implements NextVersionComponent {
    readonly initialState: NextVersionComponentState = { type: "initial-next-version" }

    material: NextVersionMaterial

    constructor(material: NextVersionMaterial) {
        super()
        this.material = material

        this.igniteHook(() => {
            this.material.find(this.post)
        })
    }
}
