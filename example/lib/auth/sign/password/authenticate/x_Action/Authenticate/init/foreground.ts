import { newEntryPoint } from "./worker/foreground"

import { initCoreAction } from "../Core/impl"

import { AuthenticatePasswordEntryPoint } from "../action"
import { newBackgroundMaterial, newForegroundMaterial } from "./common"

export function newAuthenticatePassword(
    webStorage: Storage,
    currentURL: URL,
): AuthenticatePasswordEntryPoint {
    const foreground = newForegroundMaterial(webStorage, currentURL)
    const background = newBackgroundMaterial()

    return newEntryPoint(
        initCoreAction({
            ...foreground,
            ...background,
        }),
    )
}
