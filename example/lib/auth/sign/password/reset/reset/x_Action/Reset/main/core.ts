import { newGetSecureScriptPathInfra } from "../../../../../../common/secureScriptPath/get/main"
import { newResetPasswordInfra } from "../../../main"
import { newStartContinuousRenewAuthnInfoInfra } from "../../../../../../kernel/authnInfo/common/startContinuousRenew/main"

import { initResetPasswordFormAction } from "../Form/impl"
import {
    initResetPasswordCoreAction,
    initResetPasswordCoreAction_merge,
    initResetPasswordCoreBackgroundPod,
    ResetPasswordCoreBackgroundBase,
    ResetPasswordCoreForegroundBase,
} from "../Core/impl"
import { toResetPasswordAction, toResetPasswordEntryPoint } from "../impl"

import { ResetPasswordFormAction } from "../Form/action"
import { ResetPasswordCoreAction, ResetPasswordCoreBackgroundPod } from "../Core/action"
import { ResetPasswordAction, ResetPasswordEntryPoint } from "../action"
import { newGetSecureScriptPathLocationInfo } from "../../../../../../common/secureScriptPath/get/impl"
import { newResetPasswordLocationInfo } from "../../../impl"

export function newResetPassword(webStorage: Storage, currentURL: URL): ResetPasswordEntryPoint {
    return toResetPasswordEntryPoint(mergeAction(newCoreAction(webStorage, currentURL)))
}
export function newResetPassword_proxy(
    webStorage: Storage,
    currentURL: URL,
    background: ResetPasswordCoreBackgroundPod,
): ResetPasswordEntryPoint {
    return toResetPasswordEntryPoint(
        mergeAction(
            initResetPasswordCoreAction_merge(
                newForegroundBase(webStorage),
                newLocationInfo(currentURL),
                background,
            ),
        ),
    )
}
function mergeAction(core: ResetPasswordCoreAction): ResetPasswordAction {
    return toResetPasswordAction({ core, form: newFormAction() })
}

export function newResetPasswordBackgroundPod(): ResetPasswordCoreBackgroundPod {
    return initResetPasswordCoreBackgroundPod(newBackgroundBase())
}

function newCoreAction(webStorage: Storage, currentURL: URL): ResetPasswordCoreAction {
    return initResetPasswordCoreAction(
        { ...newForegroundBase(webStorage), ...newBackgroundBase() },
        newLocationInfo(currentURL),
    )
}

function newLocationInfo(currentURL: URL) {
    return {
        ...newGetSecureScriptPathLocationInfo(currentURL),
        ...newResetPasswordLocationInfo(currentURL),
    }
}

function newForegroundBase(webStorage: Storage): ResetPasswordCoreForegroundBase {
    return {
        startContinuousRenew: newStartContinuousRenewAuthnInfoInfra(webStorage),
        getSecureScriptPath: newGetSecureScriptPathInfra(),
    }
}
function newBackgroundBase(): ResetPasswordCoreBackgroundBase {
    return {
        reset: newResetPasswordInfra(),
    }
}

function newFormAction(): ResetPasswordFormAction {
    return initResetPasswordFormAction()
}
