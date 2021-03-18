import { buildAuthenticatePasswordView } from "./worker/foreground"

import { initAuthenticatePasswordCoreAction } from "../core/impl"

import { AuthenticatePasswordView } from "../resource"
import {
    newAuthenticatePasswordCoreBackgroundMaterial,
    newAuthenticatePasswordCoreForegroundMaterial,
} from "./common"

type OutsideFeature = Readonly<{
    webStorage: Storage
    currentLocation: Location
}>
export function newAuthenticatePasswordView(
    feature: OutsideFeature,
): AuthenticatePasswordView {
    const { webStorage, currentLocation } = feature
    const foreground = newAuthenticatePasswordCoreForegroundMaterial(webStorage, currentLocation)
    const background = newAuthenticatePasswordCoreBackgroundMaterial()

    return buildAuthenticatePasswordView(
        initAuthenticatePasswordCoreAction({
            ...foreground,
            ...background,
        }),
    )
}
