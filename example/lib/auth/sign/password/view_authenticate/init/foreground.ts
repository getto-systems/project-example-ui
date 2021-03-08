import { initAuthenticatePasswordEntryPoint } from "./worker/foreground"

import { initAuthenticatePasswordCoreAction } from "../core/impl"

import { AuthenticatePasswordEntryPoint } from "../entry_point"
import {
    newAuthenticatePasswordCoreBackgroundMaterial,
    newAuthenticatePasswordCoreForegroundMaterial,
} from "./common"

type OutsideFeature = Readonly<{
    webStorage: Storage
    currentLocation: Location
}>
export function newAuthenticatePasswordEntryPoint(
    feature: OutsideFeature,
): AuthenticatePasswordEntryPoint {
    const { webStorage, currentLocation } = feature
    const foreground = newAuthenticatePasswordCoreForegroundMaterial(webStorage, currentLocation)
    const background = newAuthenticatePasswordCoreBackgroundMaterial()

    return initAuthenticatePasswordEntryPoint(
        initAuthenticatePasswordCoreAction({
            ...foreground,
            ...background,
        }),
    )
}
