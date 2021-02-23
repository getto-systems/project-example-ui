import { newGetSecureScriptPathInfra } from "../../../../../common/secureScriptPath/get/main"
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
import { toAuthenticatePasswordAction, toAuthenticatePasswordEntryPoint } from "../impl"

import { AuthenticatePasswordEntryPoint, AuthenticatePasswordAction } from "../action"
import { AuthenticatePasswordCoreAction, AuthenticatePasswordCoreBackground } from "../Core/action"
import { AuthenticatePasswordFormAction } from "../Form/action"
import { newGetSecureScriptPathLocationInfo } from "../../../../../common/secureScriptPath/get/impl"

export function newAuthenticatePassword(
    webStorage: Storage,
    currentURL: URL,
): AuthenticatePasswordEntryPoint {
    return toAuthenticatePasswordEntryPoint(mergeAction(newCoreAction(webStorage, currentURL)))
}
export function newAuthenticatePassword_proxy(
    webStorage: Storage,
    currentURL: URL,
    background: AuthenticatePasswordCoreBackground,
): AuthenticatePasswordEntryPoint {
    return toAuthenticatePasswordEntryPoint(
        mergeAction(
            initAuthenticatePasswordCoreAction_merge(
                newForegroundBase(webStorage),
                newGetSecureScriptPathLocationInfo(currentURL),
                background,
            ),
        ),
    )
}
function mergeAction(core: AuthenticatePasswordCoreAction): AuthenticatePasswordAction {
    return toAuthenticatePasswordAction({ core, form: newFormAction() })
}

export function newAuthenticatePasswordCoreBackground(): AuthenticatePasswordCoreBackground {
    return initAuthenticatePasswordCoreBackground(newBackgroundBase())
}

function newCoreAction(webStorage: Storage, currentURL: URL): AuthenticatePasswordCoreAction {
    return initAuthenticatePasswordCoreAction(
        { ...newForegroundBase(webStorage), ...newBackgroundBase() },
        newGetSecureScriptPathLocationInfo(currentURL),
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

function newFormAction(): AuthenticatePasswordFormAction {
    return initAuthenticatePasswordFormAction({
        stack: newBoardValidateStack(),
    })
}
