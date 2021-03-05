import { initAuthenticatePasswordEntryPoint } from "./worker/foreground"

import { initAuthenticatePasswordCoreAction } from "../Core/impl"

import { AuthenticatePasswordEntryPoint } from "../entryPoint"
import { newAuthenticatePasswordCoreBackgroundMaterial, newAuthenticatePasswordCoreForegroundMaterial } from "./common"

export function newAuthenticatePasswordEntryPoint(
    webStorage: Storage,
    currentLocation: Location,
): AuthenticatePasswordEntryPoint {
    const foreground = newAuthenticatePasswordCoreForegroundMaterial(webStorage, currentLocation)
    const background = newAuthenticatePasswordCoreBackgroundMaterial()

    return initAuthenticatePasswordEntryPoint(
        initAuthenticatePasswordCoreAction({
            ...foreground,
            ...background,
        }),
    )
}
