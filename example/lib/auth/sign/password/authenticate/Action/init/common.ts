import { newGetScriptPathLocationDetecter } from "../../../../common/secure/getScriptPath/impl/init"

import { newAuthenticatePasswordCoreBackgroundInfra } from "./worker/background"
import { newAuthenticatePasswordCoreForegroundInfra } from "./worker/foreground"

import {
    initAuthenticatePasswordCoreBackgroundMaterial,
    initAuthenticatePasswordCoreForegroundMaterial,
} from "../Core/impl"

import {
    AuthenticatePasswordCoreBackgroundMaterial,
    AuthenticatePasswordCoreForegroundMaterial,
} from "../Core/action"

export function newAuthenticatePasswordCoreForegroundMaterial(
    webStorage: Storage,
    currentLocation: Location,
): AuthenticatePasswordCoreForegroundMaterial {
    const infra = newAuthenticatePasswordCoreForegroundInfra(webStorage)
    const detecter = newGetScriptPathLocationDetecter(currentLocation)
    return initAuthenticatePasswordCoreForegroundMaterial(infra, detecter)
}

export function newAuthenticatePasswordCoreBackgroundMaterial(): AuthenticatePasswordCoreBackgroundMaterial {
    return initAuthenticatePasswordCoreBackgroundMaterial(newAuthenticatePasswordCoreBackgroundInfra())
}
