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
    AuthenticatePasswordForegroundInfra,
    AuthenticatePasswordBackgroundInfra,
} from "../impl"

import {
    AuthenticatePasswordAction,
    AuthenticatePasswordBackgroundMaterial,
} from "../action"

export function newAuthenticatePasswordAction(
    webStorage: Storage
): AuthenticatePasswordAction {
    return initAuthenticatePasswordAction(
        { ...newForegroundInfra(webStorage), ...newBackgroundInfra() },
        newGetSecureScriptPathLocationInfo()
    )
}
export function newAuthenticatePasswordAction_merge(
    webStorage: Storage,
    background: AuthenticatePasswordBackgroundMaterial
): AuthenticatePasswordAction {
    return initAuthenticatePasswordAction_merge(
        newForegroundInfra(webStorage),
        newGetSecureScriptPathLocationInfo(),
        background
    )
}
export function newAuthenticatePasswordBackgroundMaterial(): AuthenticatePasswordBackgroundMaterial {
    return initAuthenticatePasswordBackgroundMaterial(newBackgroundInfra())
}

function newForegroundInfra(
    webStorage: Storage
): AuthenticatePasswordForegroundInfra {
    return {
        startContinuousRenew: newStartContinuousRenewAuthnInfoInfra(webStorage),
        getSecureScriptPath: newGetSecureScriptPathInfra(),
    }
}
function newBackgroundInfra(): AuthenticatePasswordBackgroundInfra {
    return {
        authenticate: newAuthenticatePasswordInfra(),
    }
}
