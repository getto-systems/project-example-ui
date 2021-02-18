import { ApplicationAbstractAction } from "../../../../../../../common/vendor/getto-example/Application/impl"

import { clearAuthnInfo } from "../../impl"

import { ClearAuthnInfoInfra } from "../../infra"

import { LogoutAction, LogoutState, LogoutMaterial } from "./action"

export type ClearAuthnInfoBase = Readonly<{
    clear: ClearAuthnInfoInfra
}>
export function initClearAuthnInfoAction(base: ClearAuthnInfoBase): LogoutAction {
    return new Action({
        clear: clearAuthnInfo(base.clear),
    })
}

class Action extends ApplicationAbstractAction<LogoutState> implements LogoutAction {
    material: LogoutMaterial

    constructor(material: LogoutMaterial) {
        super()
        this.material = material
    }

    submit(): void {
        this.material.clear((event) => this.post(event))
    }
}
