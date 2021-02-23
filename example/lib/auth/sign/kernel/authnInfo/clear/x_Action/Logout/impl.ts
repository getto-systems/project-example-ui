import { ApplicationAbstractStateAction } from "../../../../../../../z_getto/application/impl"

import { clear } from "../../impl"

import { ClearInfra } from "../../infra"

import { LogoutAction, LogoutState, LogoutMaterial } from "./action"

export function initLogoutAction(infra: ClearInfra): LogoutAction {
    return new Action({
        clear: clear(infra),
    })
}

class Action extends ApplicationAbstractStateAction<LogoutState> implements LogoutAction {
    material: LogoutMaterial

    constructor(material: LogoutMaterial) {
        super()
        this.material = material
    }

    submit(): void {
        this.material.clear(this.post)
    }
}
