import { newResetPasswordCoreForegroundInfra, buildResetPasswordView } from "./worker/foreground"
import { newResetPasswordCoreBackgroundInfra } from "./worker/background"

import { newResetPasswordLocationDetecter } from "../../reset/impl/init"
import { newGetScriptPathLocationDetecter } from "../../../../common/secure/get_script_path/impl/init"

import { initResetPasswordCoreAction, initResetPasswordCoreMaterial } from "../core/impl"

import { ResetPasswordView } from "../resource"
import { RemoteOutsideFeature } from "../../../../../z_vendor/getto-application/infra/remote/infra"
import { RepositoryOutsideFeature } from "../../../../../z_vendor/getto-application/infra/repository/infra"
import { LocationOutsideFeature } from "../../../../../z_vendor/getto-application/location/infra"

export function newResetPasswordView(
    feature: RemoteOutsideFeature & RepositoryOutsideFeature & LocationOutsideFeature,
): ResetPasswordView {
    return buildResetPasswordView(
        initResetPasswordCoreAction(
            initResetPasswordCoreMaterial(
                {
                    ...newResetPasswordCoreForegroundInfra(feature),
                    ...newResetPasswordCoreBackgroundInfra(feature),
                },
                {
                    getSecureScriptPath: newGetScriptPathLocationDetecter(feature),
                    reset: newResetPasswordLocationDetecter(feature),
                },
            ),
        ),
    )
}
