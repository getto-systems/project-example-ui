import { ApplicationAbstractStateAction } from "../../../../z_getto/action/impl"

import {
    ExampleMaterial,
    ExampleComponent,
    ExampleComponentState,
    ExampleComponentFactory,
} from "./component"

export const initExampleComponent: ExampleComponentFactory = (material) => new Component(material)

class Component
    extends ApplicationAbstractStateAction<ExampleComponentState>
    implements ExampleComponent {
    readonly initialState: ExampleComponentState = { type: "initial-example" }

    material: ExampleMaterial

    constructor(material: ExampleMaterial) {
        super()
        this.material = material

        this.igniteHook(() => {
            this.material.loadSeason(this.post)
        })
    }
}
