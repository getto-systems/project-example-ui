import { ApplicationBaseAction } from "../../../../common/vendor/getto-example/Application/impl"

import {
    CurrentVersionMaterial,
    CurrentVersionComponent,
    CurrentVersionComponentState,
    CurrentVersionComponentFactory,
} from "./component"

export const initCurrentVersionComponent: CurrentVersionComponentFactory = (material) =>
    new Component(material)

class Component extends ApplicationBaseAction<CurrentVersionComponentState> implements CurrentVersionComponent {
    material: CurrentVersionMaterial

    constructor(material: CurrentVersionMaterial) {
        super()
        this.material = material
    }

    load(): void {
        this.material.findCurrentVersion((event) => {
            this.post(event)
        })
    }
}
