import { ApplicationBaseComponent } from "../../../../../common/getto-example/Application/impl"

import { LogoutMaterial, LogoutComponent, LogoutComponentState, LogoutComponentFactory } from "./component"

export const initLogoutComponent: LogoutComponentFactory = (material) => new Component(material)

class Component extends ApplicationBaseComponent<LogoutComponentState> implements LogoutComponent {
    material: LogoutMaterial

    constructor(material: LogoutMaterial) {
        super()
        this.material = material
    }

    submit(): void {
        this.material.clear.logout((event) => {
            this.post(event)
        })
    }
}
