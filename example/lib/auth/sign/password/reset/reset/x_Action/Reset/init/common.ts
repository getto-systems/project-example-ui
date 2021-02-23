import { newGetSecureScriptPathLocationInfo } from "../../../../../../common/secureScriptPath/get/impl"
import { newResetLocationInfo } from "../../../init"

import { newCoreBackgroundInfra } from "./worker/background"
import { newCoreForegroundInfra } from "./worker/foreground"

import {
    initCoreBackgroundMaterial,
    initCoreBackgroundMaterialPod,
    initCoreForegroundMaterial,
} from "../Core/impl"

import { CoreBackgroundMaterial, CoreBackgroundMaterialPod, CoreForegroundMaterial } from "../Core/action"

export function newCoreForegroundMaterial(
    webStorage: Storage,
    currentURL: URL,
): CoreForegroundMaterial {
    const infra = newCoreForegroundInfra(webStorage)
    const locationInfo = newGetSecureScriptPathLocationInfo(currentURL)
    return initCoreForegroundMaterial(infra, locationInfo)
}

export function newCoreBackgroundPod(): CoreBackgroundMaterialPod {
    return initCoreBackgroundMaterialPod(newCoreBackgroundInfra())
}
export function newCoreBackgroundMaterial(currentLocation: Location): CoreBackgroundMaterial {
    const infra = newCoreBackgroundInfra()
    const locationInfo = newResetLocationInfo(currentLocation)
    return initCoreBackgroundMaterial(infra, locationInfo)
}
