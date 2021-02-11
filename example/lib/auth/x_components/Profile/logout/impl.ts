import { ApplicationBaseComponent } from "../../../../sub/getto-example/x_components/Application/impl"

import { LogoutMaterial, LogoutComponent, LogoutComponentState, LogoutComponentFactory } from "./component"

export const initExampleComponent: LogoutComponentFactory = (material) => new Component(material)

class Component extends ApplicationBaseComponent<LogoutComponentState> implements LogoutComponent {
    material: LogoutMaterial

    constructor(material: LogoutMaterial) {
        super()
        this.material = material
    }

    load(): void {
        this.material.loadSeason((event) => {
            this.post(event)
        })
    }
}
