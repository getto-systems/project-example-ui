import { ApplicationAbstractAction } from "../../../../../../../../z_getto/application/impl"

import { registerPassword } from "../../../impl"
import { getSecureScriptPath } from "../../../../../../common/secureScriptPath/get/impl"
import { startContinuousRenewAuthnInfo } from "../../../../../../kernel/authnInfo/common/startContinuousRenew/impl"

import { StartContinuousRenewAuthnInfoInfra } from "../../../../../../kernel/authnInfo/common/startContinuousRenew/infra"
import { GetSecureScriptPathInfra } from "../../../../../../common/secureScriptPath/get/infra"
import { RegisterPasswordInfra } from "../../../infra"

import {
    RegisterPasswordCoreMaterial,
    RegisterPasswordCoreAction,
    RegisterPasswordCoreState,
    RegisterPasswordCoreBackground,
    RegisterPasswordCoreForeground,
} from "./action"

import { GetSecureScriptPathLocationInfo } from "../../../../../../common/secureScriptPath/get/method"
import { RegisterPasswordLocationInfo } from "../../../method"

import { LoadSecureScriptError } from "../../../../../../common/secureScriptPath/get/data"
import { FormConvertResult } from "../../../../../../../../z_getto/getto-form/form/data"
import { PasswordResetFields } from "../../../data"
import { AuthnInfo } from "../../../../../../kernel/authnInfo/kernel/data"

export type RegisterPasswordCoreBase = RegisterPasswordCoreForegroundBase &
    RegisterPasswordCoreBackgroundBase

export type RegisterPasswordCoreForegroundBase = Readonly<{
    startContinuousRenew: StartContinuousRenewAuthnInfoInfra
    getSecureScriptPath: GetSecureScriptPathInfra
}>
export type RegisterPasswordCoreBackgroundBase = Readonly<{
    register: RegisterPasswordInfra
}>

export function initRegisterPasswordCoreAction(
    infra: RegisterPasswordCoreBase,
    locationInfo: GetSecureScriptPathLocationInfo & RegisterPasswordLocationInfo
): RegisterPasswordCoreAction {
    return initRegisterPasswordCoreAction_merge(
        infra,
        locationInfo,
        initRegisterPasswordCoreBackground(infra, locationInfo)
    )
}
export function initRegisterPasswordCoreAction_merge(
    infra: RegisterPasswordCoreForegroundBase,
    locationInfo: GetSecureScriptPathLocationInfo,
    background: RegisterPasswordCoreBackground
): RegisterPasswordCoreAction {
    return new Action({
        ...initRegisterPasswordCoreForeground(infra, locationInfo),
        ...background,
    })
}
function initRegisterPasswordCoreForeground(
    infra: RegisterPasswordCoreForegroundBase,
    locationInfo: GetSecureScriptPathLocationInfo
): RegisterPasswordCoreForeground {
    return {
        startContinuousRenew: startContinuousRenewAuthnInfo(infra.startContinuousRenew),
        getSecureScriptPath: getSecureScriptPath(infra.getSecureScriptPath)(locationInfo),
    }
}
export function initRegisterPasswordCoreBackground(
    infra: RegisterPasswordCoreBackgroundBase,
    locationInfo: RegisterPasswordLocationInfo
): RegisterPasswordCoreBackground {
    return {
        register: registerPassword(infra.register)(locationInfo),
    }
}

class Action
    extends ApplicationAbstractAction<RegisterPasswordCoreState>
    implements RegisterPasswordCoreAction {
    material: RegisterPasswordCoreMaterial

    constructor(material: RegisterPasswordCoreMaterial) {
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
