import { ApplicationAbstractStateAction } from "../../../../z_vendor/getto-application/action/impl"
import { clearAuthTicket } from "../../clear/impl/core"
import { ClearAuthTicketInfra } from "../../clear/infra"

import {
    initialLogoutCoreState,
    LogoutCoreAction,
    LogoutCoreMaterial,
    LogoutCoreState,
} from "./action"

export function initLogoutCoreMaterial(infra: ClearAuthTicketInfra): LogoutCoreMaterial {
    return {
        clear: clearAuthTicket(infra),
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

    submit(): Promise<LogoutCoreState> {
        return this.material.clear(this.post)
    }
}
