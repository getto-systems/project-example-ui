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
import { RemoteOutsideFeature } from "../../../../../z_vendor/getto-application/infra/remote/infra"
import { RepositoryOutsideFeature } from "../../../../../z_vendor/getto-application/infra/repository/infra"
import { LocationOutsideFeature } from "../../../../../z_vendor/getto-application/location/infra"

export function newCoreForegroundMaterial(
    feature: RemoteOutsideFeature & RepositoryOutsideFeature & LocationOutsideFeature,
): ResetPasswordCoreForegroundMaterial {
    const infra = newResetPasswordCoreForegroundInfra(feature)
    return initResetPasswordCoreForegroundMaterial(infra, {
        getSecureScriptPath: newGetScriptPathLocationDetecter(feature),
    })
}

export function newCoreBackgroundPod(
    feature: RemoteOutsideFeature,
): ResetPasswordCoreBackgroundMaterialPod {
    return initResetPasswordCoreBackgroundMaterialPod(newResetPasswordCoreBackgroundInfra(feature))
}
export function newCoreBackgroundMaterial(
    feature: RemoteOutsideFeature & LocationOutsideFeature,
): ResetPasswordCoreBackgroundMaterial {
    const infra = newResetPasswordCoreBackgroundInfra(feature)
    return initResetPasswordCoreBackgroundMaterial(infra, {
        reset: newResetPasswordLocationDetecter(feature),
    })
}
