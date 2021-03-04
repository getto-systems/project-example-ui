import { newCoreForegroundInfra, newEntryPoint } from "./worker/foreground"
import { newCoreBackgroundInfra } from "./worker/background"

import { newResetLocationDetecter } from "../../../init"
import { newSecureScriptPathLocationDetecter } from "../../../../../../common/secureScriptPath/get/init"

import { initCoreAction, initCoreMaterial } from "../Core/impl"

import { ResetPasswordEntryPoint } from "../action"

export function newResetPassword(
    webStorage: Storage,
    currentLocation: Location,
): ResetPasswordEntryPoint {
    return newEntryPoint(
        initCoreAction(
            initCoreMaterial(
                { ...newCoreForegroundInfra(webStorage), ...newCoreBackgroundInfra() },
                {
                    getSecureScriptPath: newSecureScriptPathLocationDetecter(currentLocation),
                    reset: newResetLocationDetecter(currentLocation),
                },
            ),
        ),
    )
}
