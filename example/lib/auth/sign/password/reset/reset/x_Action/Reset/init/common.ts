import { newGetSecureScriptPathLocationInfo } from "../../../../../../common/secureScriptPath/get/impl"
import { newResetLocationInfo } from "../../../init"

import { newCoreBackgroundInfra } from "./worker/background"
import { newCoreForegroundInfra } from "./worker/foreground"

import {
    initCoreBackgroundMaterial,
    initCoreBackgroundPod,
    initCoreForegroundMaterial,
} from "../Core/impl"

import { CoreBackgroundMaterial, CoreBackgroundPod, CoreForegroundMaterial } from "../Core/action"

export function newCoreForegroundMaterial(
    webStorage: Storage,
    currentURL: URL,
): CoreForegroundMaterial {
    const infra = newCoreForegroundInfra(webStorage)
    const locationInfo = newGetSecureScriptPathLocationInfo(currentURL)
    return initCoreForegroundMaterial(infra, locationInfo)
}

export function newCoreBackgroundPod(): CoreBackgroundPod {
    return initCoreBackgroundPod(newCoreBackgroundInfra())
}
export function newCoreBackgroundMaterial(currentLocation: Location): CoreBackgroundMaterial {
    const infra = newCoreBackgroundInfra()
    const locationInfo = newResetLocationInfo(currentLocation)
    return initCoreBackgroundMaterial(infra, locationInfo)
}
