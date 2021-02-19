import {
    newGetSecureScriptPathInfra,
    newGetSecureScriptPathLocationInfo,
} from "../../../../../common/secureScriptPath/get/main"
import { newStartContinuousRenewAuthnInfoInfra } from "../../../../../kernel/authnInfo/common/startContinuousRenew/main"
import { newAuthenticatePasswordInfra } from "../../../main"
import { newBoard } from "../../../../../../../common/vendor/getto-board/kernel/infra/board"
import { newBoardValidateStack } from "../../../../../../../common/vendor/getto-board/kernel/infra/stack"

import { initAuthenticatePasswordFormResource } from "../Form/impl"
import {
    AuthenticatePasswordCoreBackgroundBase,
    AuthenticatePasswordCoreForegroundBase,
    initAuthenticatePasswordCoreAction,
    initAuthenticatePasswordCoreAction_merge,
    initAuthenticatePasswordCoreBackground,
} from "../Core/impl"
import { toAuthenticatePasswordEntryPoint } from "../impl"

import { AuthenticatePasswordEntryPoint, AuthenticatePasswordResource } from "../action"
import { AuthenticatePasswordCoreAction, AuthenticatePasswordCoreBackground } from "../Core/action"
import { AuthenticatePasswordFormResource } from "../Form/action"

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
function mergeResource(core: AuthenticatePasswordCoreAction): AuthenticatePasswordResource {
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

function newFormResource(): AuthenticatePasswordFormResource {
    return initAuthenticatePasswordFormResource({
        board: newBoard(),
        stack: newBoardValidateStack(),
    })
}
