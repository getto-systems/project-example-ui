import { ApplicationBaseComponent } from "../../../../../vendor/getto-example/Application/impl"

import { LogoutMaterial, LogoutComponent, LogoutComponentState, LogoutComponentFactory } from "./component"

export const initLogoutComponent: LogoutComponentFactory = (material) => new Component(material)

class Component extends ApplicationBaseComponent<LogoutComponentState> implements LogoutComponent {
    material: LogoutMaterial

    constructor(material: LogoutMaterial) {
        super()
        this.material = material
    }

    submit(): void {
        this.material.clear.submit((event) => {
            this.post(event)
        })
    }
}
