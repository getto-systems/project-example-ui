import { ApplicationAbstractAction } from "../../../../../../../z_getto/application/impl"

import {
    StartPasswordResetSessionMaterial,
    StartPasswordResetSessionAction,
    StartPasswordResetSessionState,
} from "./action"

import {
    PasswordResetSessionID,
    PasswordResetSessionFields,
} from "../../../../../password/resetSession/start/data"
import { FormConvertResult } from "../../../../../../../z_getto/getto-form/form/data"
import {
    CheckPasswordResetSessionStatusInfra,
    StartPasswordResetSessionInfra,
} from "../../../../../password/resetSession/start/infra"
import {
    checkPasswordResetSessionStatus,
    startPasswordResetSession,
} from "../../../../../password/resetSession/start/impl"

export type StartPasswordResetSessionBase = Readonly<{
    start: StartPasswordResetSessionInfra
    checkStatus: CheckPasswordResetSessionStatusInfra
}>

export function initStartPasswordResetSessionAction(
    base: StartPasswordResetSessionBase
): StartPasswordResetSessionAction {
    return initStartPasswordResetSessionAction_merge(initStartPasswordResetSessionMaterial(base))
}
export function initStartPasswordResetSessionAction_merge(
    material: StartPasswordResetSessionMaterial
): StartPasswordResetSessionAction {
    return new Action(material)
}
export function initStartPasswordResetSessionMaterial(
    base: StartPasswordResetSessionBase
): StartPasswordResetSessionMaterial {
    return {
        start: startPasswordResetSession(base.start),
        checkStatus: checkPasswordResetSessionStatus(base.checkStatus),
    }
}

class Action
    extends ApplicationAbstractAction<StartPasswordResetSessionState>
    implements StartPasswordResetSessionAction {
    material: StartPasswordResetSessionMaterial

    constructor(material: StartPasswordResetSessionMaterial) {
        super()
        this.material = material
    }

    submit(fields: FormConvertResult<PasswordResetSessionFields>): void {
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
