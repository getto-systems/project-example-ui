import { newCoreForegroundInfra, newEntryPoint } from "./worker/foreground"
import { newCoreBackgroundInfra } from "./worker/background"

import { newResetPasswordLocationDetecter } from "../../impl/init"
import { newGetScriptPathLocationDetecter } from "../../../../../common/secure/getScriptPath/impl/init"

import { initResetPasswordCoreAction, initResetPasswordCoreMaterial } from "../Core/impl"

import { ResetPasswordEntryPoint } from "../entryPoint"

type OutsideFeature = Readonly<{
    webStorage: Storage
    currentLocation: Location
}>
export function newResetPassword(feature: OutsideFeature): ResetPasswordEntryPoint {
    const { webStorage, currentLocation } = feature
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
