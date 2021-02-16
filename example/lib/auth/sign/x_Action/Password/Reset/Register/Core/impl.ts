import { ApplicationBaseAction } from "../../../../../../../common/vendor/getto-example/Application/impl"

import { registerPasswordResetSession } from "../../../../../password/resetSession/register/impl"
import { getSecureScriptPath } from "../../../../../secureScriptPath/get/impl"
import { startContinuousRenewAuthnInfo } from "../../../../../authnInfo/startContinuousRenew/impl"

import { StartContinuousRenewAuthnInfoInfra } from "../../../../../authnInfo/startContinuousRenew/infra"
import { GetSecureScriptPathInfra } from "../../../../../secureScriptPath/get/infra"
import { RegisterPasswordResetSessionInfra } from "../../../../../password/resetSession/register/infra"

import {
    RegisterPasswordResetSessionMaterial,
    RegisterPasswordResetSessionAction,
    RegisterPasswordResetSessionActionState,
    RegisterPasswordResetSessionBackgroundMaterial,
    RegisterPasswordResetSessionForegroundMaterial,
} from "./action"

import { GetSecureScriptPathLocationInfo } from "../../../../../secureScriptPath/get/method"
import { RegisterPasswordResetSessionLocationInfo } from "../../../../../password/resetSession/register/method"

import { LoadSecureScriptError } from "../../../../../secureScriptPath/get/data"
import { FormConvertResult } from "../../../../../../../common/vendor/getto-form/form/data"
import { PasswordResetFields } from "../../../../../password/resetSession/register/data"
import { AuthnInfo } from "../../../../../authnInfo/common/data"

export type RegisterPasswordResetSessionActionLocationInfo = GetSecureScriptPathLocationInfo &
    RegisterPasswordResetSessionLocationInfo

export type RegisterPasswordResetSessionActionInfra = RegisterPasswordResetSessionForegroundInfra &
    RegisterPasswordResetSessionBackgroundInfra

export type RegisterPasswordResetSessionForegroundInfra = Readonly<{
    startContinuousRenew: StartContinuousRenewAuthnInfoInfra
    getSecureScriptPath: GetSecureScriptPathInfra
}>
export type RegisterPasswordResetSessionBackgroundInfra = Readonly<{
    register: RegisterPasswordResetSessionInfra
}>

export function initRegisterPasswordResetSessionAction(
    infra: RegisterPasswordResetSessionActionInfra,
    locationInfo: RegisterPasswordResetSessionActionLocationInfo
): RegisterPasswordResetSessionAction {
    return initRegisterPasswordResetSessionAction_merge(
        infra,
        locationInfo,
        initRegisterPasswordResetSessionBackgroundMaterial(infra, locationInfo)
    )
}
export function initRegisterPasswordResetSessionAction_merge(
    infra: RegisterPasswordResetSessionForegroundInfra,
    locationInfo: GetSecureScriptPathLocationInfo,
    background: RegisterPasswordResetSessionBackgroundMaterial
): RegisterPasswordResetSessionAction {
    return new Action({
        ...initRegisterPasswordResetSessionForegroundMaterial(infra, locationInfo),
        ...background,
    })
}
function initRegisterPasswordResetSessionForegroundMaterial(
    infra: RegisterPasswordResetSessionForegroundInfra,
    locationInfo: GetSecureScriptPathLocationInfo
): RegisterPasswordResetSessionForegroundMaterial {
    return {
        startContinuousRenew: startContinuousRenewAuthnInfo(infra.startContinuousRenew),
        getSecureScriptPath: getSecureScriptPath(infra.getSecureScriptPath)(locationInfo),
    }
}
export function initRegisterPasswordResetSessionBackgroundMaterial(
    infra: RegisterPasswordResetSessionBackgroundInfra,
    locationInfo: RegisterPasswordResetSessionLocationInfo
): RegisterPasswordResetSessionBackgroundMaterial {
    return {
        register: registerPasswordResetSession(infra.register)(locationInfo),
    }
}

class Action
    extends ApplicationBaseAction<RegisterPasswordResetSessionActionState>
    implements RegisterPasswordResetSessionAction {
    material: RegisterPasswordResetSessionMaterial

    constructor(material: RegisterPasswordResetSessionMaterial) {
        super()
        this.material = material
    }

    submit(fields: FormConvertResult<PasswordResetFields>): void {
        this.material.register(fields, (event) => {
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
