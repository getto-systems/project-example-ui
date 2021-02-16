import { ApplicationBaseAction } from "../../../../../../common/vendor/getto-example/Application/impl"

import { startContinuousRenewAuthnInfo } from "../../../../authnInfo/startContinuousRenew/impl"
import { getSecureScriptPath } from "../../../../secureScriptPath/get/impl"
import { GetSecureScriptPathLocationInfo } from "../../../../secureScriptPath/get/method"
import { authenticatePassword } from "../../../../password/authenticate/impl"

import { AuthenticatePasswordInfra } from "../../../../password/authenticate/infra"
import { StartContinuousRenewAuthnInfoInfra } from "../../../../authnInfo/startContinuousRenew/infra"
import { GetSecureScriptPathInfra } from "../../../../secureScriptPath/get/infra"

import {
    AuthenticatePasswordMaterial,
    AuthenticatePasswordAction,
    AuthenticatePasswordActionState,
    AuthenticatePasswordBackgroundMaterial,
    AuthenticatePasswordForegroundMaterial,
} from "./action"

import { FormConvertResult } from "../../../../../../common/vendor/getto-form/form/data"
import { LoadSecureScriptError } from "../../../../secureScriptPath/get/data"
import { AuthenticatePasswordFields } from "../../../../password/authenticate/data"
import { AuthnInfo } from "../../../../authnInfo/common/data"

export type AuthenticatePasswordActionInfra = AuthenticatePasswordForegroundInfra &
    AuthenticatePasswordBackgroundInfra

export type AuthenticatePasswordForegroundInfra = Readonly<{
    startContinuousRenew: StartContinuousRenewAuthnInfoInfra
    getSecureScriptPath: GetSecureScriptPathInfra
}>
export type AuthenticatePasswordBackgroundInfra = Readonly<{
    authenticate: AuthenticatePasswordInfra
}>

export function initAuthenticatePasswordAction(
    infra: AuthenticatePasswordActionInfra,
    locationInfo: GetSecureScriptPathLocationInfo
): AuthenticatePasswordAction {
    return initAuthenticatePasswordAction_merge(
        infra,
        locationInfo,
        initAuthenticatePasswordBackgroundMaterial(infra)
    )
}
export function initAuthenticatePasswordAction_merge(
    infra: AuthenticatePasswordForegroundInfra,
    locationInfo: GetSecureScriptPathLocationInfo,
    background: AuthenticatePasswordBackgroundMaterial
): AuthenticatePasswordAction {
    return new Action({
        ...initAuthenticatePasswordForegroundMaterial(infra, locationInfo),
        ...background,
    })
}
function initAuthenticatePasswordForegroundMaterial(
    infra: AuthenticatePasswordForegroundInfra,
    locationInfo: GetSecureScriptPathLocationInfo
): AuthenticatePasswordForegroundMaterial {
    return {
        startContinuousRenew: startContinuousRenewAuthnInfo(infra.startContinuousRenew),
        getSecureScriptPath: getSecureScriptPath(infra.getSecureScriptPath)(locationInfo),
    }
}
export function initAuthenticatePasswordBackgroundMaterial(
    infra: AuthenticatePasswordBackgroundInfra
): AuthenticatePasswordBackgroundMaterial {
    return {
        authenticate: authenticatePassword(infra.authenticate),
    }
}

class Action
    extends ApplicationBaseAction<AuthenticatePasswordActionState>
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
