import { newResetPasswordCoreForegroundInfra, buildResetPasswordEntryPoint } from "./worker/foreground"
import { newResetPasswordCoreBackgroundInfra } from "./worker/background"

import { newResetPasswordLocationDetecter } from "../../reset/impl/init"
import { newGetScriptPathLocationDetecter } from "../../../../common/secure/get_script_path/impl/init"

import { initResetPasswordCoreAction, initResetPasswordCoreMaterial } from "../core/impl"

import { ResetPasswordEntryPoint } from "../entry_point"

type OutsideFeature = Readonly<{
    webStorage: Storage
    currentLocation: Location
}>
export function newResetPasswordEntryPoint(feature: OutsideFeature): ResetPasswordEntryPoint {
    const { webStorage, currentLocation } = feature
    return buildResetPasswordEntryPoint(
        initResetPasswordCoreAction(
            initResetPasswordCoreMaterial(
                { ...newResetPasswordCoreForegroundInfra(webStorage), ...newResetPasswordCoreBackgroundInfra() },
                {
                    getSecureScriptPath: newGetScriptPathLocationDetecter(currentLocation),
                    reset: newResetPasswordLocationDetecter(currentLocation),
                },
            ),
        ),
    )
}
