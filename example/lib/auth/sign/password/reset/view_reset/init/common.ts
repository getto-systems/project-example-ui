import { newResetPasswordLocationDetecter } from "../../reset/impl/init"
import { newGetScriptPathLocationDetecter } from "../../../../common/secure/get_script_path/impl/init"

import { newResetPasswordCoreBackgroundInfra } from "./worker/background"
import { newResetPasswordCoreForegroundInfra } from "./worker/foreground"

import {
    initResetPasswordCoreBackgroundMaterial,
    initResetPasswordCoreBackgroundMaterialPod,
    initResetPasswordCoreForegroundMaterial,
} from "../core/impl"

import {
    ResetPasswordCoreBackgroundMaterial,
    ResetPasswordCoreBackgroundMaterialPod,
    ResetPasswordCoreForegroundMaterial,
} from "../core/action"

export function newCoreForegroundMaterial(
    webStorage: Storage,
    currentLocation: Location,
): ResetPasswordCoreForegroundMaterial {
    const infra = newResetPasswordCoreForegroundInfra(webStorage)
    return initResetPasswordCoreForegroundMaterial(infra, {
        getSecureScriptPath: newGetScriptPathLocationDetecter(currentLocation),
    })
}

export function newCoreBackgroundPod(): ResetPasswordCoreBackgroundMaterialPod {
    return initResetPasswordCoreBackgroundMaterialPod(newResetPasswordCoreBackgroundInfra())
}
export function newCoreBackgroundMaterial(currentLocation: Location): ResetPasswordCoreBackgroundMaterial {
    const infra = newResetPasswordCoreBackgroundInfra()
    return initResetPasswordCoreBackgroundMaterial(infra, {
        reset: newResetPasswordLocationDetecter(currentLocation),
    })
}
