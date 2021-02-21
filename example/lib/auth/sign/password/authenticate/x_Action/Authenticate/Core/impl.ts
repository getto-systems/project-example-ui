import { ApplicationAbstractAction } from "../../../../../../../z_getto/application/impl"

import { startContinuousRenewAuthnInfo } from "../../../../../kernel/authnInfo/common/startContinuousRenew/impl"
import { getSecureScriptPath } from "../../../../../common/secureScriptPath/get/impl"
import { GetSecureScriptPathLocationInfo } from "../../../../../common/secureScriptPath/get/method"
import { authenticatePassword } from "../../../impl"

import { AuthenticatePasswordInfra } from "../../../infra"
import { StartContinuousRenewAuthnInfoInfra } from "../../../../../kernel/authnInfo/common/startContinuousRenew/infra"
import { GetSecureScriptPathInfra } from "../../../../../common/secureScriptPath/get/infra"

import {
    AuthenticatePasswordCoreMaterial,
    AuthenticatePasswordCoreAction,
    AuthenticatePasswordCoreState,
    AuthenticatePasswordCoreBackground,
    AuthenticatePasswordCoreForeground,
} from "./action"

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

export function initAuthenticatePasswordCoreAction(
    infra: AuthenticatePasswordCoreBase,
    locationInfo: GetSecureScriptPathLocationInfo,
): AuthenticatePasswordCoreAction {
    return initAuthenticatePasswordCoreAction_merge(
        infra,
        locationInfo,
        initAuthenticatePasswordCoreBackground(infra),
    )
}
export function initAuthenticatePasswordCoreAction_merge(
    infra: AuthenticatePasswordCoreForegroundBase,
    locationInfo: GetSecureScriptPathLocationInfo,
    background: AuthenticatePasswordCoreBackground,
): AuthenticatePasswordCoreAction {
    return new Action({
        ...initAuthenticatePasswordCoreForeground(infra, locationInfo),
        ...background,
    })
}
function initAuthenticatePasswordCoreForeground(
    infra: AuthenticatePasswordCoreForegroundBase,
    locationInfo: GetSecureScriptPathLocationInfo,
): AuthenticatePasswordCoreForeground {
    return {
        startContinuousRenew: startContinuousRenewAuthnInfo(infra.startContinuousRenew),
        getSecureScriptPath: getSecureScriptPath(infra.getSecureScriptPath)(locationInfo),
    }
}
export function initAuthenticatePasswordCoreBackground(
    infra: AuthenticatePasswordCoreBackgroundBase,
): AuthenticatePasswordCoreBackground {
    return {
        authenticate: authenticatePassword(infra.authenticate),
    }
}

class Action
    extends ApplicationAbstractAction<AuthenticatePasswordCoreState>
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
