import { env } from "../../../../../../y_environment/env"

import { newApi_SendResetToken } from "../../../../../../z_external/api/auth/password/reset/check_status/send_token"

import {
    remoteFeature,
    convertRemote,
} from "../../../../../../z_vendor/getto-application/infra/remote/helper"

import { RemoteOutsideFeature } from "../../../../../../z_vendor/getto-application/infra/remote/infra"
import { SendResetTokenRemotePod } from "../../infra"

export function newSendResetTokenRemote(feature: RemoteOutsideFeature): SendResetTokenRemotePod {
    return convertRemote(newApi_SendResetToken(remoteFeature(env.apiServerURL, feature)))
}
