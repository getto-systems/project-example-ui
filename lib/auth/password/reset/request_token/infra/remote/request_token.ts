import { env } from "../../../../../../y_environment/env"

import { newApi_RequestResetToken } from "../../../../../../z_details/api/auth/password/reset/request_token"

import {
    remoteFeature,
    convertRemote,
} from "../../../../../../z_vendor/getto-application/infra/remote/helper"

import { RemoteOutsideFeature } from "../../../../../../z_vendor/getto-application/infra/remote/infra"
import { RequestResetTokenRemotePod } from "../../infra"

export function newRequestResetTokenRemote(
    feature: RemoteOutsideFeature,
): RequestResetTokenRemotePod {
    return convertRemote(newApi_RequestResetToken(remoteFeature(env.apiServerURL, feature)))
}
