import { newStartContinuousRenewAuthnInfoInfra } from "../../../../../authnInfo/startContinuousRenew/main"
import { newAuthenticatePasswordInfra } from "../../../../../password/authenticate/main"
import {
    newGetSecureScriptPathInfra,
    newGetSecureScriptPathLocationInfo,
} from "../../../../../secureScriptPath/get/main"

import {
    initAuthenticatePasswordAction,
    initAuthenticatePasswordBackgroundMaterial,
    initAuthenticatePasswordAction_merge,
} from "../impl"

import {
    AuthenticatePasswordAction,
    AuthenticatePasswordBackgroundMaterial,
} from "../action"

export function newAuthenticatePasswordAction(
    webStorage: Storage
): AuthenticatePasswordAction {
    return initAuthenticatePasswordAction(
        {
            authenticate: newAuthenticatePasswordInfra(),
            startContinuousRenew: newStartContinuousRenewAuthnInfoInfra(webStorage),
            getSecureScriptPath: newGetSecureScriptPathInfra(),
        },
        newGetSecureScriptPathLocationInfo()
    )
}
export function newAuthenticatePasswordAction_merge(
    webStorage: Storage,
    background: AuthenticatePasswordBackgroundMaterial
): AuthenticatePasswordAction {
    return initAuthenticatePasswordAction_merge(
        {
            startContinuousRenew: newStartContinuousRenewAuthnInfoInfra(webStorage),
            getSecureScriptPath: newGetSecureScriptPathInfra(),
        },
        newGetSecureScriptPathLocationInfo(),
        background
    )
}
export function newAuthenticatePasswordBackgroundMaterial(): AuthenticatePasswordBackgroundMaterial {
    return initAuthenticatePasswordBackgroundMaterial({
        authenticate: newAuthenticatePasswordInfra(),
    })
}
