import { newBackgroundBase } from "./worker/background"
import { newForegroundBase } from "./worker/foreground"

import { initBackgroundMaterial, initForegroundMaterial } from "../Core/impl"

import { newGetSecureScriptPathLocationInfo } from "../../../../../common/secureScriptPath/get/impl"

import {
    AuthenticatePasswordCoreBackground,
    AuthenticatePasswordCoreForeground,
} from "../Core/action"

export function newForegroundMaterial(
    webStorage: Storage,
    currentURL: URL,
): AuthenticatePasswordCoreForeground {
    const base = newForegroundBase(webStorage)
    const locationInfo = newGetSecureScriptPathLocationInfo(currentURL)
    return initForegroundMaterial(base, locationInfo)
}

export function newBackgroundMaterial(): AuthenticatePasswordCoreBackground {
    return initBackgroundMaterial(newBackgroundBase())
}
