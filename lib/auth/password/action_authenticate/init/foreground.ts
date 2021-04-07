import { buildAuthenticatePasswordView } from "./worker/foreground"

import { initAuthenticatePasswordCoreAction } from "../core/impl"

import { AuthenticatePasswordView } from "../resource"
import {
    newAuthenticatePasswordCoreBackgroundMaterial,
    newAuthenticatePasswordCoreForegroundMaterial,
} from "./common"

type OutsideFeature = Readonly<{
    webDB: IDBFactory
    webCrypto: Crypto
    currentLocation: Location
}>
export function newAuthenticatePasswordView(feature: OutsideFeature): AuthenticatePasswordView {
    const { webDB, webCrypto, currentLocation } = feature
    const foreground = newAuthenticatePasswordCoreForegroundMaterial(
        webDB,
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
