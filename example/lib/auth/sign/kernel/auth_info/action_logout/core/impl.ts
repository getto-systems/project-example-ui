import { ApplicationAbstractStateAction } from "../../../../../../z_vendor/getto-application/action/impl"
import { clearAuthInfo } from "../../clear/impl/core"
import { ClearAuthInfoInfra } from "../../clear/infra"

import {
    initialLogoutCoreState,
    LogoutCoreAction,
    LogoutCoreMaterial,
    LogoutCoreState,
} from "./action"

export function initLogoutCoreMaterial(infra: ClearAuthInfoInfra): LogoutCoreMaterial {
    return {
        clear: clearAuthInfo(infra),
    }
}

export function initLogoutCoreAction(material: LogoutCoreMaterial): LogoutCoreAction {
    return new Action(material)
}

class Action extends ApplicationAbstractStateAction<LogoutCoreState> implements LogoutCoreAction {
    readonly initialState = initialLogoutCoreState

    material: LogoutCoreMaterial

    constructor(material: LogoutCoreMaterial) {
        super()
        this.material = material
    }

    submit(): void {
        this.material.clear(this.post)
    }
}
