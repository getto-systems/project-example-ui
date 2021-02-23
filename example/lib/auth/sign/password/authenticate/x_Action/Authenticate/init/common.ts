import { newBackgroundInfra } from "./worker/background"
import { newForegroundInfra } from "./worker/foreground"

import { initCoreBackgroundMaterial, initCoreForegroundMaterial } from "../Core/impl"

import { newGetSecureScriptPathLocationInfo } from "../../../../../common/secureScriptPath/get/impl"

import { CoreBackgroundMaterial, CoreForegroundMaterial } from "../Core/action"

export function newForegroundMaterial(
    webStorage: Storage,
    currentURL: URL,
): CoreForegroundMaterial {
    const infra = newForegroundInfra(webStorage)
    const locationInfo = newGetSecureScriptPathLocationInfo(currentURL)
    return initCoreForegroundMaterial(infra, locationInfo)
}

export function newBackgroundMaterial(): CoreBackgroundMaterial {
    return initCoreBackgroundMaterial(newBackgroundInfra())
}
