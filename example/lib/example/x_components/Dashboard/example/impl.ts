import { ApplicationBaseComponent } from "../../../../vendor/getto-example/Application/impl"

import {
    ExampleMaterial,
    ExampleComponent,
    ExampleComponentState,
    ExampleComponentFactory,
} from "./component"

export const initExampleComponent: ExampleComponentFactory = (material) => new Component(material)

class Component extends ApplicationBaseComponent<ExampleComponentState> implements ExampleComponent {
    material: ExampleMaterial

    constructor(material: ExampleMaterial) {
        super()
        this.material = material
    }

    load(): void {
        this.material.loadSeason((event) => {
            this.post(event)
        })
    }
}
