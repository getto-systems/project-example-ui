import { newResetPasswordCoreForegroundInfra, buildResetPasswordView } from "./worker/foreground"
import { newResetPasswordCoreBackgroundInfra } from "./worker/background"

import { newResetPasswordLocationDetecter } from "../../reset/impl/init"
import { newGetScriptPathLocationDetecter } from "../../../../common/secure/get_script_path/impl/init"

import { initResetPasswordCoreAction, initResetPasswordCoreMaterial } from "../core/impl"

import { ResetPasswordView } from "../resource"

type OutsideFeature = Readonly<{
    webStorage: Storage
    webCrypto: Crypto
    currentLocation: Location
}>
export function newResetPasswordView(feature: OutsideFeature): ResetPasswordView {
    const { webStorage, webCrypto, currentLocation } = feature
    return buildResetPasswordView(
        initResetPasswordCoreAction(
            initResetPasswordCoreMaterial(
                {
                    ...newResetPasswordCoreForegroundInfra(webStorage, webCrypto),
                    ...newResetPasswordCoreBackgroundInfra(webCrypto),
                },
                {
                    getSecureScriptPath: newGetScriptPathLocationDetecter(currentLocation),
                    reset: newResetPasswordLocationDetecter(currentLocation),
                },
            ),
        ),
    )
}
