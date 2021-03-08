import { newCoreForegroundInfra, newEntryPoint } from "./worker/foreground"
import { newCoreBackgroundInfra } from "./worker/background"

import { newResetPasswordLocationDetecter } from "../../reset/impl/init"
import { newGetScriptPathLocationDetecter } from "../../../../common/secure/get_script_path/impl/init"

import { initResetPasswordCoreAction, initResetPasswordCoreMaterial } from "../core/impl"

import { ResetPasswordEntryPoint } from "../entry_point"

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
