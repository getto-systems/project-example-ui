import { newStartContinuousRenewAuthnInfoInfra } from "../../../../../../kernel/authnInfo/startContinuousRenew/main"
import {
    newRegisterPasswordInfra,
    newRegisterPasswordLocationInfo,
} from "../../../../../../password/resetSession/register/main"
import {
    newGetSecureScriptPathInfra,
    newGetSecureScriptPathLocationInfo,
} from "../../../../../../common/secureScriptPath/get/main"
import { RegisterPasswordAction, RegisterPasswordBackground } from "../action"
import {
    initRegisterPasswordAction,
    initRegisterPasswordAction_merge,
    initRegisterPasswordBackground,
    RegisterPasswordBackgroundBase,
    RegisterPasswordForegroundBase,
} from "../impl"

export function newRegisterPasswordAction(webStorage: Storage): RegisterPasswordAction {
    return initRegisterPasswordAction(
        { ...newForegroundBase(webStorage), ...newBackgroundBase() },
        {
            ...newGetSecureScriptPathLocationInfo(),
            ...newRegisterPasswordLocationInfo(),
        }
    )
}
export function newRegisterPasswordAction_merge(
    webStorage: Storage,
    background: RegisterPasswordBackground
): RegisterPasswordAction {
    return initRegisterPasswordAction_merge(
        newForegroundBase(webStorage),
        newGetSecureScriptPathLocationInfo(),
        background
    )
}
export function newRegisterPasswordBackground(): RegisterPasswordBackground {
    return initRegisterPasswordBackground(
        newBackgroundBase(),
        newRegisterPasswordLocationInfo()
    )
}

function newForegroundBase(webStorage: Storage): RegisterPasswordForegroundBase {
    return {
        startContinuousRenew: newStartContinuousRenewAuthnInfoInfra(webStorage),
        getSecureScriptPath: newGetSecureScriptPathInfra(),
    }
}
function newBackgroundBase(): RegisterPasswordBackgroundBase {
    return {
        register: newRegisterPasswordInfra(),
    }
}
