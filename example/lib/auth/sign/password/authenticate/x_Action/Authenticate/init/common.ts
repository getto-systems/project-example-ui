import { newBackgroundBase } from "./worker/background"
import { newForegroundBase } from "./worker/foreground"

import { initCoreBackgroundMaterial, initCoreForegroundMaterial } from "../Core/impl"

import { newGetSecureScriptPathLocationInfo } from "../../../../../common/secureScriptPath/get/impl"

import { CoreBackgroundMaterial, CoreForegroundMaterial } from "../Core/action"

export function newForegroundMaterial(
    webStorage: Storage,
    currentURL: URL,
): CoreForegroundMaterial {
    const base = newForegroundBase(webStorage)
    const locationInfo = newGetSecureScriptPathLocationInfo(currentURL)
    return initCoreForegroundMaterial(base, locationInfo)
}

export function newBackgroundMaterial(): CoreBackgroundMaterial {
    return initCoreBackgroundMaterial(newBackgroundBase())
}
