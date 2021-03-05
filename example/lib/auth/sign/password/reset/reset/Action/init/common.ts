import { newResetPasswordLocationDetecter } from "../../impl/init"
import { newGetScriptPathLocationDetecter } from "../../../../../common/secure/getScriptPath/impl/init"

import { newCoreBackgroundInfra } from "./worker/background"
import { newCoreForegroundInfra } from "./worker/foreground"

import {
    initResetPasswordCoreBackgroundMaterial,
    initResetPasswordCoreBackgroundMaterialPod,
    initResetPasswordCoreForegroundMaterial,
} from "../Core/impl"

import {
    ResetPasswordCoreBackgroundMaterial,
    ResetPasswordCoreBackgroundMaterialPod,
    ResetPasswordCoreForegroundMaterial,
} from "../Core/action"

export function newCoreForegroundMaterial(
    webStorage: Storage,
    currentLocation: Location,
): ResetPasswordCoreForegroundMaterial {
    const infra = newCoreForegroundInfra(webStorage)
    return initResetPasswordCoreForegroundMaterial(infra, {
        getSecureScriptPath: newGetScriptPathLocationDetecter(currentLocation),
    })
}

export function newCoreBackgroundPod(): ResetPasswordCoreBackgroundMaterialPod {
    return initResetPasswordCoreBackgroundMaterialPod(newCoreBackgroundInfra())
}
export function newCoreBackgroundMaterial(currentLocation: Location): ResetPasswordCoreBackgroundMaterial {
    const infra = newCoreBackgroundInfra()
    return initResetPasswordCoreBackgroundMaterial(infra, {
        reset: newResetPasswordLocationDetecter(currentLocation),
    })
}
