import { env } from "../../../../../y_environment/env"

import { newApi_AuthenticatePassword } from "../../../../../z_external/api/auth/password/authenticate"

import {
    remoteFeature,
    convertRemote,
} from "../../../../../z_vendor/getto-application/infra/remote/helper"

import { RemoteOutsideFeature } from "../../../../../z_vendor/getto-application/infra/remote/infra"
import { AuthenticatePasswordRemotePod } from "../../infra"

export function newAuthenticatePasswordRemote(
    feature: RemoteOutsideFeature,
): AuthenticatePasswordRemotePod {
    return convertRemote(newApi_AuthenticatePassword(remoteFeature(env.apiServerURL, feature)))
}
