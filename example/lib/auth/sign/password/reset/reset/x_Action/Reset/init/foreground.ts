import { newCoreForegroundInfra, newEntryPoint } from "./worker/foreground"
import { newCoreBackgroundInfra } from "./worker/background"

import { newResetLocationDetecter } from "../../../init"
import { newGetScriptPathLocationDetecter } from "../../../../../../common/secure/getScriptPath/impl/init"

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
                    getSecureScriptPath: newGetScriptPathLocationDetecter(currentLocation),
                    reset: newResetLocationDetecter(currentLocation),
                },
            ),
        ),
    )
}
