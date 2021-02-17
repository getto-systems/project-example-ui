import { ApplicationAbstractAction } from "../../../../../common/vendor/getto-example/Application/impl"

import { clearAuthnInfo } from "../../../kernel/authnInfo/clear/impl"

import { ClearAuthnInfoInfra } from "../../../kernel/authnInfo/clear/infra"

import {
    ClearAuthnInfoAction,
    ClearAuthnInfoState,
    ClearAuthnInfoMaterial,
} from "./action"

export type ClearAuthnInfoBase = Readonly<{
    clear: ClearAuthnInfoInfra
}>
export function initClearAuthnInfoAction(base: ClearAuthnInfoBase): ClearAuthnInfoAction {
    return new Action({
        clear: clearAuthnInfo(base.clear),
    })
}

class Action
    extends ApplicationAbstractAction<ClearAuthnInfoState>
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
