import { ApplicationAbstractAction } from "../../../../z_getto/application/impl"

import {
    NextVersionComponentFactory,
    NextVersionMaterial,
    NextVersionComponent,
    NextVersionComponentState,
} from "./component"

export const initNextVersionComponent: NextVersionComponentFactory = (material) =>
    new Component(material)

class Component
    extends ApplicationAbstractAction<NextVersionComponentState>
    implements NextVersionComponent {
    material: NextVersionMaterial

    constructor(material: NextVersionMaterial) {
        super()
        this.material = material

        this.igniteHook(() => {
            this.material.find((event) => {
                this.post(event)
            })
        })
    }
}
