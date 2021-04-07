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
import { RemoteOutsideFeature } from "../../../../z_vendor/getto-application/infra/remote/infra"
import { RepositoryOutsideFeature } from "../../../../z_vendor/getto-application/infra/repository/infra"
import { LocationOutsideFeature } from "../../../../z_vendor/getto-application/location/infra"

export function newAuthenticatePasswordCoreForegroundMaterial(
    feature: RemoteOutsideFeature & RepositoryOutsideFeature & LocationOutsideFeature,
): AuthenticatePasswordCoreForegroundMaterial {
    const infra = newAuthenticatePasswordCoreForegroundInfra(feature)
    const detecter = newGetScriptPathLocationDetecter(feature)
    return initAuthenticatePasswordCoreForegroundMaterial(infra, detecter)
}

export function newAuthenticatePasswordCoreBackgroundMaterial(
    feature: RemoteOutsideFeature,
): AuthenticatePasswordCoreBackgroundMaterial {
    return initAuthenticatePasswordCoreBackgroundMaterial(
        newAuthenticatePasswordCoreBackgroundInfra(feature),
    )
}
