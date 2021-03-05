import { newCoreForegroundInfra, newEntryPoint } from "./worker/foreground"
import { newCoreBackgroundInfra } from "./worker/background"

import { newResetPasswordLocationDetecter } from "../../impl/init"
import { newGetScriptPathLocationDetecter } from "../../../../../common/secure/getScriptPath/impl/init"

import { initResetPasswordCoreAction, initResetPasswordCoreMaterial } from "../Core/impl"

import { ResetPasswordEntryPoint } from "../action"

export function newResetPassword(
    webStorage: Storage,
    currentLocation: Location,
): ResetPasswordEntryPoint {
    return newEntryPoint(
        initResetPasswordCoreAction(
            initResetPasswordCoreMaterial(
                { ...newCoreForegroundInfra(webStorage), ...newCoreBackgroundInfra() },
                {
                    getSecureScriptPath: newGetScriptPathLocationDetecter(currentLocation),
                    reset: newResetPasswordLocationDetecter(currentLocation),
                },
            ),
        ),
    )
}
