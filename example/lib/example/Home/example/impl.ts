import { ApplicationBaseComponent } from "../../../sub/getto-example/application/impl"

import { ExampleMaterial, ExampleComponent, ExampleState, ExampleComponentFactory } from "./component"

export const initExampleComponent: ExampleComponentFactory = (material) => new Component(material)

class Component extends ApplicationBaseComponent<ExampleState> implements ExampleComponent {
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
