import { ApplicationAbstractAction } from "../../../../z_getto/application/impl"

import {
    ExampleMaterial,
    ExampleComponent,
    ExampleComponentState,
    ExampleComponentFactory,
} from "./component"

export const initExampleComponent: ExampleComponentFactory = (material) => new Component(material)

class Component
    extends ApplicationAbstractAction<ExampleComponentState>
    implements ExampleComponent {
    material: ExampleMaterial

    constructor(material: ExampleMaterial) {
        super()
        this.material = material

        this.igniteHook(() => {
            this.material.loadSeason(this.post)
        })
    }
}
