import {
    newGetSecureScriptPathInfra,
    newGetSecureScriptPathLocationInfo,
} from "../../../../../common/secureScriptPath/get/main"
import { newStartContinuousRenewAuthnInfoInfra } from "../../../../../kernel/authnInfo/common/startContinuousRenew/main"
import { newAuthenticatePasswordInfra } from "../../../main"
import { newBoardValidateStack } from "../../../../../../../z_getto/board/kernel/infra/stack"

import { initAuthenticatePasswordFormAction } from "../Form/impl"
import {
    AuthenticatePasswordCoreBackgroundBase,
    AuthenticatePasswordCoreForegroundBase,
    initAuthenticatePasswordCoreAction,
    initAuthenticatePasswordCoreAction_merge,
    initAuthenticatePasswordCoreBackground,
} from "../Core/impl"
import { toAuthenticatePasswordEntryPoint } from "../impl"

import { AuthenticatePasswordEntryPoint, AuthenticatePasswordAction } from "../action"
import { AuthenticatePasswordCoreAction, AuthenticatePasswordCoreBackground } from "../Core/action"
import { AuthenticatePasswordFormAction } from "../Form/action"

export function newAuthenticatePassword(webStorage: Storage): AuthenticatePasswordEntryPoint {
    return toAuthenticatePasswordEntryPoint(mergeResource(newCoreAction(webStorage)))
}
export function newAuthenticatePassword_proxy(
    webStorage: Storage,
    background: AuthenticatePasswordCoreBackground
): AuthenticatePasswordEntryPoint {
    return toAuthenticatePasswordEntryPoint(
        mergeResource(
            initAuthenticatePasswordCoreAction_merge(
                newForegroundBase(webStorage),
                newGetSecureScriptPathLocationInfo(),
                background
            )
        )
    )
}
function mergeResource(core: AuthenticatePasswordCoreAction): AuthenticatePasswordAction {
    return { core, form: newFormResource() }
}

export function newAuthenticatePasswordCoreBackground(): AuthenticatePasswordCoreBackground {
    return initAuthenticatePasswordCoreBackground(newBackgroundBase())
}

function newCoreAction(webStorage: Storage): AuthenticatePasswordCoreAction {
    return initAuthenticatePasswordCoreAction(
        { ...newForegroundBase(webStorage), ...newBackgroundBase() },
        newGetSecureScriptPathLocationInfo()
    )
}

function newForegroundBase(webStorage: Storage): AuthenticatePasswordCoreForegroundBase {
    return {
        startContinuousRenew: newStartContinuousRenewAuthnInfoInfra(webStorage),
        getSecureScriptPath: newGetSecureScriptPathInfra(),
    }
}
function newBackgroundBase(): AuthenticatePasswordCoreBackgroundBase {
    return {
        authenticate: newAuthenticatePasswordInfra(),
    }
}

function newFormResource(): AuthenticatePasswordFormAction {
    return initAuthenticatePasswordFormAction({
        stack: newBoardValidateStack(),
    })
}
