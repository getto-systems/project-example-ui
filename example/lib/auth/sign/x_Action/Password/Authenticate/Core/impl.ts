import { ApplicationAbstractAction } from "../../../../../../common/vendor/getto-example/Application/impl"

import { startContinuousRenewAuthnInfo } from "../../../../kernel/authnInfo/startContinuousRenew/impl"
import { getSecureScriptPath } from "../../../../secureScriptPath/get/impl"
import { GetSecureScriptPathLocationInfo } from "../../../../secureScriptPath/get/method"
import { authenticatePassword } from "../../../../password/authenticate/impl"

import { AuthenticatePasswordInfra } from "../../../../password/authenticate/infra"
import { StartContinuousRenewAuthnInfoInfra } from "../../../../kernel/authnInfo/startContinuousRenew/infra"
import { GetSecureScriptPathInfra } from "../../../../secureScriptPath/get/infra"

import {
    AuthenticatePasswordMaterial,
    AuthenticatePasswordAction,
    AuthenticatePasswordState,
    AuthenticatePasswordBackground,
    AuthenticatePasswordForeground,
} from "./action"

import { FormConvertResult } from "../../../../../../common/vendor/getto-form/form/data"
import { LoadSecureScriptError } from "../../../../secureScriptPath/get/data"
import { AuthenticatePasswordFields } from "../../../../password/authenticate/data"
import { AuthnInfo } from "../../../../kernel/authnInfo/common/data"

export type AuthenticatePasswordBase = AuthenticatePasswordForegroundBase &
    AuthenticatePasswordBackgroundBase

export type AuthenticatePasswordForegroundBase = Readonly<{
    startContinuousRenew: StartContinuousRenewAuthnInfoInfra
    getSecureScriptPath: GetSecureScriptPathInfra
}>
export type AuthenticatePasswordBackgroundBase = Readonly<{
    authenticate: AuthenticatePasswordInfra
}>

export function initAuthenticatePasswordAction(
    infra: AuthenticatePasswordBase,
    locationInfo: GetSecureScriptPathLocationInfo
): AuthenticatePasswordAction {
    return initAuthenticatePasswordAction_merge(
        infra,
        locationInfo,
        initAuthenticatePasswordBackground(infra)
    )
}
export function initAuthenticatePasswordAction_merge(
    infra: AuthenticatePasswordForegroundBase,
    locationInfo: GetSecureScriptPathLocationInfo,
    background: AuthenticatePasswordBackground
): AuthenticatePasswordAction {
    return new Action({
        ...initAuthenticatePasswordForeground(infra, locationInfo),
        ...background,
    })
}
function initAuthenticatePasswordForeground(
    infra: AuthenticatePasswordForegroundBase,
    locationInfo: GetSecureScriptPathLocationInfo
): AuthenticatePasswordForeground {
    return {
        startContinuousRenew: startContinuousRenewAuthnInfo(infra.startContinuousRenew),
        getSecureScriptPath: getSecureScriptPath(infra.getSecureScriptPath)(locationInfo),
    }
}
export function initAuthenticatePasswordBackground(
    infra: AuthenticatePasswordBackgroundBase
): AuthenticatePasswordBackground {
    return {
        authenticate: authenticatePassword(infra.authenticate),
    }
}

class Action
    extends ApplicationAbstractAction<AuthenticatePasswordState>
    implements AuthenticatePasswordAction {
    material: AuthenticatePasswordMaterial

    constructor(material: AuthenticatePasswordMaterial) {
        super()
        this.material = material
    }

    submit(fields: FormConvertResult<AuthenticatePasswordFields>): void {
        this.material.authenticate(fields, (event) => {
            switch (event.type) {
                case "succeed-to-login":
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
