import { newCoreBackgroundInfra } from "./worker/background"
import { newCoreForegroundInfra } from "./worker/foreground"

import { initCoreBackgroundMaterial, initCoreForegroundMaterial } from "../Core/impl"

import { newGetSecureScriptPathLocationInfo } from "../../../../../common/secureScriptPath/get/impl"

import { CoreBackgroundMaterial, CoreForegroundMaterial } from "../Core/action"

export function newCoreForegroundMaterial(
    webStorage: Storage,
    currentURL: URL,
): CoreForegroundMaterial {
    const infra = newCoreForegroundInfra(webStorage)
    const locationInfo = newGetSecureScriptPathLocationInfo(currentURL)
    return initCoreForegroundMaterial(infra, locationInfo)
}

export function newCoreBackgroundMaterial(): CoreBackgroundMaterial {
    return initCoreBackgroundMaterial(newCoreBackgroundInfra())
}
