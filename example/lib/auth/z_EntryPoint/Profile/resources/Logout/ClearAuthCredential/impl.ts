import { ApplicationBaseComponent } from "../../../../../../vendor/getto-example/Application/impl"

import {
    ClearAuthCredentialComponent,
    ClearAuthCredentialComponentState,
    ClearAuthCredentialMaterial,
} from "./component"

export function initClearAuthCredentialComponent(
    material: ClearAuthCredentialMaterial
): ClearAuthCredentialComponent {
    return new Component(material)
}

class Component
    extends ApplicationBaseComponent<ClearAuthCredentialComponentState>
    implements ClearAuthCredentialComponent {
    material: ClearAuthCredentialMaterial

    constructor(material: ClearAuthCredentialMaterial) {
        super()
        this.material = material
    }

    submit(): void {
        this.material.foreground.clear.submit((event) => {
            this.post(event)
        })
    }
}
