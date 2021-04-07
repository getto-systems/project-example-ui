import { buildAuthenticatePasswordView } from "./worker/foreground"

import { initAuthenticatePasswordCoreAction } from "../core/impl"

import { AuthenticatePasswordView } from "../resource"
import {
    newAuthenticatePasswordCoreBackgroundMaterial,
    newAuthenticatePasswordCoreForegroundMaterial,
} from "./common"
import { RemoteOutsideFeature } from "../../../../z_vendor/getto-application/infra/remote/infra"
import { RepositoryOutsideFeature } from "../../../../z_vendor/getto-application/infra/repository/infra"
import { LocationOutsideFeature } from "../../../../z_vendor/getto-application/location/infra"

export function newAuthenticatePasswordView(
    feature: RemoteOutsideFeature & RepositoryOutsideFeature & LocationOutsideFeature,
): AuthenticatePasswordView {
    const foreground = newAuthenticatePasswordCoreForegroundMaterial(feature)
    const background = newAuthenticatePasswordCoreBackgroundMaterial(feature)

    return buildAuthenticatePasswordView(
        initAuthenticatePasswordCoreAction({
            ...foreground,
            ...background,
        }),
    )
}
