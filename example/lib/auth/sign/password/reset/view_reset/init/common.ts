import { newResetPasswordLocationDetecter } from "../../reset/impl/init"
import { newGetScriptPathLocationDetecter } from "../../../../common/secure/get_script_path/impl/init"

import { newCoreBackgroundInfra } from "./worker/background"
import { newCoreForegroundInfra } from "./worker/foreground"

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
