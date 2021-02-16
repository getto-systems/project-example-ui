import { ApplicationBaseAction } from "../../../../../common/vendor/getto-example/Application/impl"

import { clearAuthnInfo } from "../../../authnInfo/clear/impl"

import { ClearAuthnInfoInfra } from "../../../authnInfo/clear/infra"

import {
    ClearAuthnInfoAction,
    ClearAuthnInfoActionState,
    ClearAuthnInfoMaterial,
} from "./action"

export type ClearAuthnInfoActionInfra = Readonly<{
    clear: ClearAuthnInfoInfra
}>
export function initClearAuthnInfoAction(
    infra: ClearAuthnInfoActionInfra
): ClearAuthnInfoAction {
    return new Action({
        clear: clearAuthnInfo(infra.clear),
    })
}

class Action
    extends ApplicationBaseAction<ClearAuthnInfoActionState>
    implements ClearAuthnInfoAction {
    material: ClearAuthnInfoMaterial

    constructor(material: ClearAuthnInfoMaterial) {
        super()
        this.material = material
    }

    submit(): void {
        this.material.clear((event) => {
            this.post(event)
        })
    }
}
