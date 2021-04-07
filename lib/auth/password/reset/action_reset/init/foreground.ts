import { newResetPasswordCoreForegroundInfra, buildResetPasswordView } from "./worker/foreground"
import { newResetPasswordCoreBackgroundInfra } from "./worker/background"

import { newResetPasswordLocationDetecter } from "../../reset/impl/init"
import { newGetScriptPathLocationDetecter } from "../../../../common/secure/get_script_path/impl/init"

import { initResetPasswordCoreAction, initResetPasswordCoreMaterial } from "../core/impl"

import { ResetPasswordView } from "../resource"

type OutsideFeature = Readonly<{
    webStorage: Storage
    webDB: IDBFactory
    webCrypto: Crypto
    currentLocation: Location
}>
export function newResetPasswordView(feature: OutsideFeature): ResetPasswordView {
    const { webStorage, webDB, webCrypto, currentLocation } = feature
    return buildResetPasswordView(
        initResetPasswordCoreAction(
            initResetPasswordCoreMaterial(
                {
                    ...newResetPasswordCoreForegroundInfra(webStorage, webDB, webCrypto),
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
