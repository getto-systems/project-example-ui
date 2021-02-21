import { ApplicationAbstractAction } from "../../../../../../../../z_getto/application/impl"

import { checkPasswordResetSessionStatus, startPasswordResetSession } from "../../../impl"

import {
    CheckPasswordResetSessionStatusInfra,
    StartPasswordResetSessionInfra,
} from "../../../infra"

import {
    StartPasswordResetSessionCoreMaterial,
    StartPasswordResetSessionCoreAction,
    StartPasswordResetSessionCoreState,
} from "./action"

import { PasswordResetSessionID, PasswordResetSessionFields } from "../../../data"
import { BoardConvertResult } from "../../../../../../../../z_getto/board/kernel/data"

export type StartPasswordResetSessionCoreBase = Readonly<{
    start: StartPasswordResetSessionInfra
    checkStatus: CheckPasswordResetSessionStatusInfra
}>

export function initStartPasswordResetSessionCoreAction(
    base: StartPasswordResetSessionCoreBase,
): StartPasswordResetSessionCoreAction {
    return initStartPasswordResetSessionCoreAction_merge(
        initStartPasswordResetSessionCoreMaterial(base),
    )
}
export function initStartPasswordResetSessionCoreAction_merge(
    material: StartPasswordResetSessionCoreMaterial,
): StartPasswordResetSessionCoreAction {
    return new Action(material)
}
export function initStartPasswordResetSessionCoreMaterial(
    base: StartPasswordResetSessionCoreBase,
): StartPasswordResetSessionCoreMaterial {
    return {
        start: startPasswordResetSession(base.start),
        checkStatus: checkPasswordResetSessionStatus(base.checkStatus),
    }
}

class Action
    extends ApplicationAbstractAction<StartPasswordResetSessionCoreState>
    implements StartPasswordResetSessionCoreAction {
    material: StartPasswordResetSessionCoreMaterial

    constructor(material: StartPasswordResetSessionCoreMaterial) {
        super()
        this.material = material
    }

    submit(fields: BoardConvertResult<PasswordResetSessionFields>): void {
        this.material.start(fields, (event) => {
            switch (event.type) {
                case "succeed-to-start-session":
                    this.checkStatus(event.sessionID)
                    return

                default:
                    this.post(event)
                    return
            }
        })
    }

    checkStatus(sessionID: PasswordResetSessionID): void {
        this.material.checkStatus(sessionID, this.post)
    }
}
