import { newStartContinuousRenewAuthnInfoInfra } from "../../../../../kernel/authnInfo/common/startContinuousRenew/main"
import { newAuthenticatePasswordInfra } from "../../../../../password/authenticate/main"
import {
    newGetSecureScriptPathInfra,
    newGetSecureScriptPathLocationInfo,
} from "../../../../../common/secureScriptPath/get/main"

import {
    initAuthenticatePasswordAction,
    initAuthenticatePasswordBackground,
    initAuthenticatePasswordAction_merge,
    AuthenticatePasswordForegroundBase,
    AuthenticatePasswordBackgroundBase,
} from "../impl"

import { AuthenticatePasswordAction, AuthenticatePasswordBackground } from "../action"

export function newAuthenticatePasswordAction(
    webStorage: Storage
): AuthenticatePasswordAction {
    return initAuthenticatePasswordAction(
        { ...newForegroundBase(webStorage), ...newBackgroundBase() },
        newGetSecureScriptPathLocationInfo()
    )
}
export function newAuthenticatePasswordAction_merge(
    webStorage: Storage,
    background: AuthenticatePasswordBackground
): AuthenticatePasswordAction {
    return initAuthenticatePasswordAction_merge(
        newForegroundBase(webStorage),
        newGetSecureScriptPathLocationInfo(),
        background
    )
}
export function newAuthenticatePasswordBackground(): AuthenticatePasswordBackground {
    return initAuthenticatePasswordBackground(newBackgroundBase())
}

function newForegroundBase(webStorage: Storage): AuthenticatePasswordForegroundBase {
    return {
        startContinuousRenew: newStartContinuousRenewAuthnInfoInfra(webStorage),
        getSecureScriptPath: newGetSecureScriptPathInfra(),
    }
}
function newBackgroundBase(): AuthenticatePasswordBackgroundBase {
    return {
        authenticate: newAuthenticatePasswordInfra(),
    }
}
