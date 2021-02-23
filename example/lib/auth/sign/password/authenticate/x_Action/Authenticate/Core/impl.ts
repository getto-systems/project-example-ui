import { ApplicationAbstractStateAction } from "../../../../../../../z_getto/application/impl"

import { startContinuousRenewAuthnInfo } from "../../../../../kernel/authnInfo/common/startContinuousRenew/impl"
import { getSecureScriptPath } from "../../../../../common/secureScriptPath/get/impl"
import { authenticatePassword } from "../../../impl"

import { AuthenticatePasswordInfra } from "../../../infra"
import { StartContinuousRenewAuthnInfoInfra } from "../../../../../kernel/authnInfo/common/startContinuousRenew/infra"
import { GetSecureScriptPathInfra } from "../../../../../common/secureScriptPath/get/infra"

import {
    AuthenticatePasswordCoreMaterial,
    AuthenticatePasswordCoreAction,
    AuthenticatePasswordCoreState,
    AuthenticatePasswordCoreForeground,
    AuthenticatePasswordCoreBackground,
} from "./action"

import { GetSecureScriptPathLocationInfo } from "../../../../../common/secureScriptPath/get/method"

import { LoadSecureScriptError } from "../../../../../common/secureScriptPath/get/data"
import { AuthenticatePasswordFields } from "../../../data"
import { AuthnInfo } from "../../../../../kernel/authnInfo/kernel/data"
import { BoardConvertResult } from "../../../../../../../z_getto/board/kernel/data"

export type AuthenticatePasswordCoreBase = AuthenticatePasswordCoreForegroundBase &
    AuthenticatePasswordCoreBackgroundBase

export type AuthenticatePasswordCoreForegroundBase = Readonly<{
    startContinuousRenew: StartContinuousRenewAuthnInfoInfra
    getSecureScriptPath: GetSecureScriptPathInfra
}>
export type AuthenticatePasswordCoreBackgroundBase = Readonly<{
    authenticate: AuthenticatePasswordInfra
}>

export function initAuthenticatePasswordCoreMaterial(
    base: AuthenticatePasswordCoreBase,
    locationInfo: GetSecureScriptPathLocationInfo,
): AuthenticatePasswordCoreMaterial {
    return {
        ...initForegroundMaterial(base, locationInfo),
        ...initBackgroundMaterial(base),
    }
}
export function initForegroundMaterial(
    base: AuthenticatePasswordCoreForegroundBase,
    locationInfo: GetSecureScriptPathLocationInfo,
): AuthenticatePasswordCoreForeground {
    return {
        startContinuousRenew: startContinuousRenewAuthnInfo(base.startContinuousRenew),
        getSecureScriptPath: getSecureScriptPath(base.getSecureScriptPath)(locationInfo),
    }
}
export function initBackgroundMaterial(
    base: AuthenticatePasswordCoreBackgroundBase,
): AuthenticatePasswordCoreBackground {
    return {
        authenticate: authenticatePassword(base.authenticate),
    }
}

export function initAuthenticatePasswordCoreAction(
    material: AuthenticatePasswordCoreMaterial,
): AuthenticatePasswordCoreAction {
    return new Action(material)
}

class Action
    extends ApplicationAbstractStateAction<AuthenticatePasswordCoreState>
    implements AuthenticatePasswordCoreAction {
    material: AuthenticatePasswordCoreMaterial

    constructor(material: AuthenticatePasswordCoreMaterial) {
        super()
        this.material = material
    }

    submit(fields: BoardConvertResult<AuthenticatePasswordFields>): void {
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
