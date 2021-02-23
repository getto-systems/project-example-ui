import { newCoreForegroundInfra, newEntryPoint } from "./worker/foreground"
import { newCoreBackgroundInfra } from "./worker/background"

import { newGetSecureScriptPathLocationInfo } from "../../../../../../common/secureScriptPath/get/impl"
import { newResetLocationInfo } from "../../../init"

import { initCoreAction, initCoreMaterial } from "../Core/impl"

import { ResetPasswordEntryPoint } from "../action"

export function newResetPassword(
    webStorage: Storage,
    currentURL: URL,
    currentLocation: Location,
): ResetPasswordEntryPoint {
    return newEntryPoint(
        initCoreAction(
            initCoreMaterial(
                { ...newCoreForegroundInfra(webStorage), ...newCoreBackgroundInfra() },
                {
                    ...newGetSecureScriptPathLocationInfo(currentURL),
                    ...newResetLocationInfo(currentLocation),
                },
            ),
        ),
    )
}
