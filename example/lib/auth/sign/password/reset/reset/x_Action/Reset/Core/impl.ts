import { ApplicationAbstractAction } from "../../../../../../../../z_getto/application/impl"

import { resetPassword } from "../../../impl"
import { getSecureScriptPath } from "../../../../../../common/secureScriptPath/get/impl"
import { startContinuousRenewAuthnInfo } from "../../../../../../kernel/authnInfo/common/startContinuousRenew/impl"

import { StartContinuousRenewAuthnInfoInfra } from "../../../../../../kernel/authnInfo/common/startContinuousRenew/infra"
import { GetSecureScriptPathInfra } from "../../../../../../common/secureScriptPath/get/infra"
import { ResetPasswordInfra } from "../../../infra"

import {
    ResetPasswordCoreMaterial,
    ResetPasswordCoreAction,
    ResetPasswordCoreState,
    ResetPasswordCoreForeground,
    ResetPasswordCoreBackgroundPod,
} from "./action"

import { GetSecureScriptPathLocationInfo } from "../../../../../../common/secureScriptPath/get/method"
import { ResetPasswordLocationInfo } from "../../../method"

import { LoadSecureScriptError } from "../../../../../../common/secureScriptPath/get/data"
import { PasswordResetFields } from "../../../data"
import { AuthnInfo } from "../../../../../../kernel/authnInfo/kernel/data"
import { BoardConvertResult } from "../../../../../../../../z_getto/board/kernel/data"

export type ResetPasswordCoreBase = ResetPasswordCoreForegroundBase &
    ResetPasswordCoreBackgroundBase

export type ResetPasswordCoreForegroundBase = Readonly<{
    startContinuousRenew: StartContinuousRenewAuthnInfoInfra
    getSecureScriptPath: GetSecureScriptPathInfra
}>
export type ResetPasswordCoreBackgroundBase = Readonly<{
    reset: ResetPasswordInfra
}>

export function initResetPasswordCoreAction(
    infra: ResetPasswordCoreBase,
    locationInfo: GetSecureScriptPathLocationInfo & ResetPasswordLocationInfo,
): ResetPasswordCoreAction {
    return initResetPasswordCoreAction_merge(
        infra,
        locationInfo,
        initResetPasswordCoreBackgroundPod(infra),
    )
}
export function initResetPasswordCoreAction_merge(
    infra: ResetPasswordCoreForegroundBase,
    locationInfo: GetSecureScriptPathLocationInfo & ResetPasswordLocationInfo,
    background: ResetPasswordCoreBackgroundPod,
): ResetPasswordCoreAction {
    return new Action({
        ...initResetPasswordCoreForeground(infra, locationInfo),
        reset: background.initReset(locationInfo),
    })
}
function initResetPasswordCoreForeground(
    infra: ResetPasswordCoreForegroundBase,
    locationInfo: GetSecureScriptPathLocationInfo,
): ResetPasswordCoreForeground {
    return {
        startContinuousRenew: startContinuousRenewAuthnInfo(infra.startContinuousRenew),
        getSecureScriptPath: getSecureScriptPath(infra.getSecureScriptPath)(locationInfo),
    }
}
export function initResetPasswordCoreBackgroundPod(
    infra: ResetPasswordCoreBackgroundBase,
): ResetPasswordCoreBackgroundPod {
    return {
        initReset: resetPassword(infra.reset),
    }
}

class Action
    extends ApplicationAbstractAction<ResetPasswordCoreState>
    implements ResetPasswordCoreAction {
    material: ResetPasswordCoreMaterial

    constructor(material: ResetPasswordCoreMaterial) {
        super()
        this.material = material
    }

    submit(fields: BoardConvertResult<PasswordResetFields>): void {
        this.material.reset(fields, (event) => {
            switch (event.type) {
                case "succeed-to-reset":
                    this.startContinuousRenew(event.authnInfo)
                    return

                default:
                    this.post(event)
                    return
            }
        })
    }
    startContinuousRenew(authnInfo: AuthnInfo): void {
        this.material.startContinuousRenew(authnInfo, (event) => {
            switch (event.type) {
                case "succeed-to-start-continuous-renew":
                    this.post({
                        type: "try-to-load",
                        scriptPath: this.secureScriptPath(),
                    })
                    return

                default:
                    this.post(event)
                    return
            }
        })
    }

    loadError(err: LoadSecureScriptError): void {
        this.post({ type: "load-error", err })
    }

    secureScriptPath() {
        return this.material.getSecureScriptPath()
    }
}
