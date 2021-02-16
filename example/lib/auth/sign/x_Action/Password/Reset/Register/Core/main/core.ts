import { newStartContinuousRenewAuthnInfoInfra } from "../../../../../../authnInfo/startContinuousRenew/main"
import {
    newRegisterPasswordResetSessionInfra,
    newRegisterPasswordResetSessionLocationInfo,
} from "../../../../../../password/resetSession/register/main"
import {
    newGetSecureScriptPathInfra,
    newGetSecureScriptPathLocationInfo,
} from "../../../../../../secureScriptPath/get/main"
import {
    RegisterPasswordResetSessionAction,
    RegisterPasswordResetSessionBackgroundMaterial,
} from "../action"
import {
    initRegisterPasswordResetSessionAction,
    initRegisterPasswordResetSessionAction_merge,
    initRegisterPasswordResetSessionBackgroundMaterial,
    RegisterPasswordResetSessionActionLocationInfo,
    RegisterPasswordResetSessionBackgroundInfra,
    RegisterPasswordResetSessionForegroundInfra,
} from "../impl"

export function newRegisterPasswordResetSessionAction(
    webStorage: Storage
): RegisterPasswordResetSessionAction {
    return initRegisterPasswordResetSessionAction(
        { ...newForegroundInfra(webStorage), ...newBackgroundInfra() },
        newActionLocationInfo()
    )
}
export function newRegisterPasswordResetSessionAction_merge(
    webStorage: Storage,
    background: RegisterPasswordResetSessionBackgroundMaterial
): RegisterPasswordResetSessionAction {
    return initRegisterPasswordResetSessionAction_merge(
        newForegroundInfra(webStorage),
        newGetSecureScriptPathLocationInfo(),
        background
    )
}
export function newRegisterPasswordResetSessionBackgroundMaterial(): RegisterPasswordResetSessionBackgroundMaterial {
    return initRegisterPasswordResetSessionBackgroundMaterial(
        newBackgroundInfra(),
        newRegisterPasswordResetSessionLocationInfo()
    )
}

function newForegroundInfra(
    webStorage: Storage
): RegisterPasswordResetSessionForegroundInfra {
    return {
        startContinuousRenew: newStartContinuousRenewAuthnInfoInfra(webStorage),
        getSecureScriptPath: newGetSecureScriptPathInfra(),
    }
}
function newBackgroundInfra(): RegisterPasswordResetSessionBackgroundInfra {
    return {
        register: newRegisterPasswordResetSessionInfra(),
    }
}

function newActionLocationInfo(): RegisterPasswordResetSessionActionLocationInfo {
    return {
        ...newGetSecureScriptPathLocationInfo(),
        ...newRegisterPasswordResetSessionLocationInfo(),
    }
}
