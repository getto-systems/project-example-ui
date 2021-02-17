import { ApplicationAbstractAction } from "../../../../../../../common/vendor/getto-example/Application/impl"

import { registerPassword } from "../../../../../password/resetSession/register/impl"
import { getSecureScriptPath } from "../../../../../common/secureScriptPath/get/impl"
import { startContinuousRenewAuthnInfo } from "../../../../../kernel/authnInfo/startContinuousRenew/impl"

import { StartContinuousRenewAuthnInfoInfra } from "../../../../../kernel/authnInfo/startContinuousRenew/infra"
import { GetSecureScriptPathInfra } from "../../../../../common/secureScriptPath/get/infra"
import { RegisterPasswordInfra } from "../../../../../password/resetSession/register/infra"

import {
    RegisterPasswordMaterial,
    RegisterPasswordAction,
    RegisterPasswordState,
    RegisterPasswordBackground,
    RegisterPasswordForeground,
} from "./action"

import { GetSecureScriptPathLocationInfo } from "../../../../../common/secureScriptPath/get/method"
import { RegisterPasswordLocationInfo } from "../../../../../password/resetSession/register/method"

import { LoadSecureScriptError } from "../../../../../common/secureScriptPath/get/data"
import { FormConvertResult } from "../../../../../../../common/vendor/getto-form/form/data"
import { PasswordResetFields } from "../../../../../password/resetSession/register/data"
import { AuthnInfo } from "../../../../../kernel/authnInfo/common/data"

export type RegisterPasswordBase = RegisterPasswordForegroundBase &
    RegisterPasswordBackgroundBase

export type RegisterPasswordForegroundBase = Readonly<{
    startContinuousRenew: StartContinuousRenewAuthnInfoInfra
    getSecureScriptPath: GetSecureScriptPathInfra
}>
export type RegisterPasswordBackgroundBase = Readonly<{
    register: RegisterPasswordInfra
}>

export function initRegisterPasswordAction(
    infra: RegisterPasswordBase,
    locationInfo: GetSecureScriptPathLocationInfo & RegisterPasswordLocationInfo
): RegisterPasswordAction {
    return initRegisterPasswordAction_merge(
        infra,
        locationInfo,
        initRegisterPasswordBackground(infra, locationInfo)
    )
}
export function initRegisterPasswordAction_merge(
    infra: RegisterPasswordForegroundBase,
    locationInfo: GetSecureScriptPathLocationInfo,
    background: RegisterPasswordBackground
): RegisterPasswordAction {
    return new Action({
        ...initRegisterPasswordForeground(infra, locationInfo),
        ...background,
    })
}
function initRegisterPasswordForeground(
    infra: RegisterPasswordForegroundBase,
    locationInfo: GetSecureScriptPathLocationInfo
): RegisterPasswordForeground {
    return {
        startContinuousRenew: startContinuousRenewAuthnInfo(infra.startContinuousRenew),
        getSecureScriptPath: getSecureScriptPath(infra.getSecureScriptPath)(locationInfo),
    }
}
export function initRegisterPasswordBackground(
    infra: RegisterPasswordBackgroundBase,
    locationInfo: RegisterPasswordLocationInfo
): RegisterPasswordBackground {
    return {
        register: registerPassword(infra.register)(locationInfo),
    }
}

class Action
    extends ApplicationAbstractAction<RegisterPasswordState>
    implements RegisterPasswordAction {
    material: RegisterPasswordMaterial

    constructor(material: RegisterPasswordMaterial) {
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
