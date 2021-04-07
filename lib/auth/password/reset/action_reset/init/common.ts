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
    webDB: IDBFactory,
    webCrypto: Crypto,
    currentLocation: Location,
): ResetPasswordCoreForegroundMaterial {
    const infra = newResetPasswordCoreForegroundInfra(webDB, webCrypto)
    return initResetPasswordCoreForegroundMaterial(infra, {
        getSecureScriptPath: newGetScriptPathLocationDetecter(currentLocation),
    })
}

export function newCoreBackgroundPod(webCrypto: Crypto): ResetPasswordCoreBackgroundMaterialPod {
    return initResetPasswordCoreBackgroundMaterialPod(
        newResetPasswordCoreBackgroundInfra(webCrypto),
    )
}
export function newCoreBackgroundMaterial(
    webCrypto: Crypto,
    currentLocation: Location,
): ResetPasswordCoreBackgroundMaterial {
    const infra = newResetPasswordCoreBackgroundInfra(webCrypto)
    return initResetPasswordCoreBackgroundMaterial(infra, {
        reset: newResetPasswordLocationDetecter(currentLocation),
    })
}
