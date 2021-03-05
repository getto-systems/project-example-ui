import { newGetScriptPathLocationDetecter } from "../../../../../common/secure/getScriptPath/impl/init"

import { newCoreBackgroundInfra } from "./worker/background"
import { newCoreForegroundInfra } from "./worker/foreground"

import { initCoreBackgroundMaterial, initCoreForegroundMaterial } from "../Core/impl"

import { CoreBackgroundMaterial, CoreForegroundMaterial } from "../Core/action"

export function newCoreForegroundMaterial(
    webStorage: Storage,
    currentLocation: Location,
): CoreForegroundMaterial {
    const infra = newCoreForegroundInfra(webStorage)
    const detecter = newGetScriptPathLocationDetecter(currentLocation)
    return initCoreForegroundMaterial(infra, detecter)
}

export function newCoreBackgroundMaterial(): CoreBackgroundMaterial {
    return initCoreBackgroundMaterial(newCoreBackgroundInfra())
}
