import { env } from "../../../../../../y_environment/env"

import { newApi_GetResetTokenSendingStatus } from "../../../../../../z_details/api/auth/password/reset/check_status/get_sending_status"

import {
    remoteFeature,
    convertRemote,
} from "../../../../../../z_vendor/getto-application/infra/remote/helper"

import { RemoteOutsideFeature } from "../../../../../../z_vendor/getto-application/infra/remote/infra"
import { GetResetTokenSendingStatusRemotePod } from "../../infra"

export function newGetResetTokenSendingStatusRemote(
    feature: RemoteOutsideFeature,
): GetResetTokenSendingStatusRemotePod {
    return convertRemote(
        newApi_GetResetTokenSendingStatus(remoteFeature(env.apiServerURL, feature)),
    )
}
