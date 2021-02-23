import { newEntryPoint } from "./worker/foreground"

import { initCoreAction } from "../Core/impl"

import { AuthenticatePasswordEntryPoint } from "../action"
import { newCoreBackgroundMaterial, newCoreForegroundMaterial } from "./common"

export function newAuthenticatePassword(
    webStorage: Storage,
    currentURL: URL,
): AuthenticatePasswordEntryPoint {
    const foreground = newCoreForegroundMaterial(webStorage, currentURL)
    const background = newCoreBackgroundMaterial()

    return newEntryPoint(
        initCoreAction({
            ...foreground,
            ...background,
        }),
    )
}
