import { ApplicationBaseAction } from "../../../../../common/vendor/getto-example/Application/impl"

import { clearAuthCredential } from "../../../authCredential/clear/impl"

import { ClearAuthCredentialInfra } from "../../../authCredential/clear/infra"

import {
    ClearAuthCredentialAction,
    ClearAuthCredentialActionState,
    ClearAuthCredentialMaterial,
} from "./action"

export type ClearAuthCredentialActionInfra = Readonly<{
    clear: ClearAuthCredentialInfra
}>
export function initClearAuthCredentialAction(
    infra: ClearAuthCredentialActionInfra
): ClearAuthCredentialAction {
    return new Action({
        clear: clearAuthCredential(infra.clear),
    })
}

class Action
    extends ApplicationBaseAction<ClearAuthCredentialActionState>
    implements ClearAuthCredentialAction {
    material: ClearAuthCredentialMaterial

    constructor(material: ClearAuthCredentialMaterial) {
        super()
        this.material = material
    }

    submit(): void {
        this.material.clear((event) => {
            this.post(event)
        })
    }
}
