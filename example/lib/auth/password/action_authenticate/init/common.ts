import { newGetScriptPathLocationDetecter } from "../../../common/secure/get_script_path/impl/init"

import { newAuthenticatePasswordCoreBackgroundInfra } from "./worker/background"
import { newAuthenticatePasswordCoreForegroundInfra } from "./worker/foreground"

import {
    initAuthenticatePasswordCoreBackgroundMaterial,
    initAuthenticatePasswordCoreForegroundMaterial,
} from "../core/impl"

import {
    AuthenticatePasswordCoreBackgroundMaterial,
    AuthenticatePasswordCoreForegroundMaterial,
} from "../core/action"

export function newAuthenticatePasswordCoreForegroundMaterial(
    webStorage: Storage,
    webCrypto: Crypto,
    currentLocation: Location,
): AuthenticatePasswordCoreForegroundMaterial {
    const infra = newAuthenticatePasswordCoreForegroundInfra(webStorage, webCrypto)
    const detecter = newGetScriptPathLocationDetecter(currentLocation)
    return initAuthenticatePasswordCoreForegroundMaterial(infra, detecter)
}

export function newAuthenticatePasswordCoreBackgroundMaterial(
    webCrypto: Crypto,
): AuthenticatePasswordCoreBackgroundMaterial {
    return initAuthenticatePasswordCoreBackgroundMaterial(
        newAuthenticatePasswordCoreBackgroundInfra(webCrypto),
    )
}
