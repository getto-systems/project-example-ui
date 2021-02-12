import { ApplicationBaseComponent } from "../../../../sub/getto-example/Application/impl"

import {
    NextVersionComponentFactory,
    NextVersionMaterial,
    NextVersionComponent,
    NextVersionComponentState,
} from "./component"

export const initNextVersionComponent: NextVersionComponentFactory = (material) =>
    new Component(material)

class Component extends ApplicationBaseComponent<NextVersionComponentState> implements NextVersionComponent {
    material: NextVersionMaterial

    constructor(material: NextVersionMaterial) {
        super()
        this.material = material
    }

    find(): void {
        this.material.find((event) => {
            this.post(event)
        })
    }
}
