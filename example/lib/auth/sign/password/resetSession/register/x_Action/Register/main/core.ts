import {
    newGetSecureScriptPathInfra,
    newGetSecureScriptPathLocationInfo,
} from "../../../../../../common/secureScriptPath/get/main"
import { newRegisterPasswordInfra, newRegisterPasswordLocationInfo } from "../../../main"
import { newStartContinuousRenewAuthnInfoInfra } from "../../../../../../kernel/authnInfo/common/startContinuousRenew/main"

import { initRegisterPasswordFormAction } from "../Form/impl"
import { newBoardValidateStack } from "../../../../../../../../z_getto/board/kernel/infra/stack"
import {
    initRegisterPasswordCoreAction,
    initRegisterPasswordCoreAction_merge,
    initRegisterPasswordCoreBackground,
    RegisterPasswordCoreBackgroundBase,
    RegisterPasswordCoreForegroundBase,
} from "../Core/impl"
import { toRegisterPasswordEntryPoint } from "../impl"

import { RegisterPasswordFormAction } from "../Form/action"
import { RegisterPasswordCoreAction, RegisterPasswordCoreBackground } from "../Core/action"
import { RegisterPasswordAction, RegisterPasswordEntryPoint } from "../action"

export function newRegisterPassword(webStorage: Storage): RegisterPasswordEntryPoint {
    return toRegisterPasswordEntryPoint(mergeAction(newCoreAction(webStorage)))
}
export function newRegisterPassword_proxy(
    webStorage: Storage,
    background: RegisterPasswordCoreBackground
): RegisterPasswordEntryPoint {
    return toRegisterPasswordEntryPoint(
        mergeAction(
            initRegisterPasswordCoreAction_merge(
                newForegroundBase(webStorage),
                newGetSecureScriptPathLocationInfo(),
                background
            )
        )
    )
}
function mergeAction(core: RegisterPasswordCoreAction): RegisterPasswordAction {
    return { core, form: newFormAction() }
}

export function newRegisterPasswordBackground(): RegisterPasswordCoreBackground {
    return initRegisterPasswordCoreBackground(
        newBackgroundBase(),
        newRegisterPasswordLocationInfo()
    )
}

function newCoreAction(webStorage: Storage): RegisterPasswordCoreAction {
    return initRegisterPasswordCoreAction(
        { ...newForegroundBase(webStorage), ...newBackgroundBase() },
        {
            ...newGetSecureScriptPathLocationInfo(),
            ...newRegisterPasswordLocationInfo(),
        }
    )
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
