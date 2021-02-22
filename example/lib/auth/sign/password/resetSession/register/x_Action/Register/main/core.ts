import { newGetSecureScriptPathInfra } from "../../../../../../common/secureScriptPath/get/main"
import { newRegisterPasswordInfra } from "../../../main"
import { newStartContinuousRenewAuthnInfoInfra } from "../../../../../../kernel/authnInfo/common/startContinuousRenew/main"

import { initRegisterPasswordFormAction } from "../Form/impl"
import { newBoardValidateStack } from "../../../../../../../../z_getto/board/kernel/infra/stack"
import {
    initRegisterPasswordCoreAction,
    initRegisterPasswordCoreAction_merge,
    initRegisterPasswordCoreBackgroundPod,
    RegisterPasswordCoreBackgroundBase,
    RegisterPasswordCoreForegroundBase,
} from "../Core/impl"
import { toRegisterPasswordEntryPoint } from "../impl"

import { RegisterPasswordFormAction } from "../Form/action"
import { RegisterPasswordCoreAction, RegisterPasswordCoreBackgroundPod } from "../Core/action"
import { RegisterPasswordAction, RegisterPasswordEntryPoint } from "../action"
import { newGetSecureScriptPathLocationInfo } from "../../../../../../common/secureScriptPath/get/impl"
import { newRegisterPasswordLocationInfo } from "../../../impl"

export function newRegisterPassword(
    webStorage: Storage,
    currentURL: URL,
): RegisterPasswordEntryPoint {
    return toRegisterPasswordEntryPoint(mergeAction(newCoreAction(webStorage, currentURL)))
}
export function newRegisterPassword_proxy(
    webStorage: Storage,
    currentURL: URL,
    background: RegisterPasswordCoreBackgroundPod,
): RegisterPasswordEntryPoint {
    return toRegisterPasswordEntryPoint(
        mergeAction(
            initRegisterPasswordCoreAction_merge(
                newForegroundBase(webStorage),
                newLocationInfo(currentURL),
                background,
            ),
        ),
    )
}
function mergeAction(core: RegisterPasswordCoreAction): RegisterPasswordAction {
    return { core, form: newFormAction() }
}

export function newRegisterPasswordBackgroundPod(): RegisterPasswordCoreBackgroundPod {
    return initRegisterPasswordCoreBackgroundPod(newBackgroundBase())
}

function newCoreAction(webStorage: Storage, currentURL: URL): RegisterPasswordCoreAction {
    return initRegisterPasswordCoreAction(
        { ...newForegroundBase(webStorage), ...newBackgroundBase() },
        newLocationInfo(currentURL),
    )
}

function newLocationInfo(currentURL: URL) {
    return {
        ...newGetSecureScriptPathLocationInfo(currentURL),
        ...newRegisterPasswordLocationInfo(currentURL),
    }
}

function newForegroundBase(webStorage: Storage): RegisterPasswordCoreForegroundBase {
    return {
        startContinuousRenew: newStartContinuousRenewAuthnInfoInfra(webStorage),
        getSecureScriptPath: newGetSecureScriptPathInfra(),
    }
}
function newBackgroundBase(): RegisterPasswordCoreBackgroundBase {
    return {
        register: newRegisterPasswordInfra(),
    }
}

function newFormAction(): RegisterPasswordFormAction {
    return initRegisterPasswordFormAction({
        stack: newBoardValidateStack(),
    })
}
