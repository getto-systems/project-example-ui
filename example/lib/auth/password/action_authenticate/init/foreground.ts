import { buildAuthenticatePasswordView } from "./worker/foreground"

import { initAuthenticatePasswordCoreAction } from "../core/impl"

import { AuthenticatePasswordView } from "../resource"
import {
    newAuthenticatePasswordCoreBackgroundMaterial,
    newAuthenticatePasswordCoreForegroundMaterial,
} from "./common"

type OutsideFeature = Readonly<{
    webStorage: Storage
    webCrypto: Crypto
    currentLocation: Location
}>
export function newAuthenticatePasswordView(feature: OutsideFeature): AuthenticatePasswordView {
    const { webStorage, webCrypto, currentLocation } = feature
    const foreground = newAuthenticatePasswordCoreForegroundMaterial(
        webStorage,
        webCrypto,
        currentLocation,
    )
    const background = newAuthenticatePasswordCoreBackgroundMaterial(webCrypto)

    return buildAuthenticatePasswordView(
        initAuthenticatePasswordCoreAction({
            ...foreground,
            ...background,
        }),
    )
}
