import { env } from "../../../../../../y_environment/env"

import { newApi_GetResetTokenSendingStatus } from "../../../../../../z_external/api/auth/password/reset/check_status/get_sending_status"

import {
    remoteInfraError,
    wrapRemote,
} from "../../../../../../z_vendor/getto-application/infra/remote/helper"

import { GetResetTokenSendingStatusRemotePod } from "../../infra"

export function newGetResetTokenSendingStatusRemote(): GetResetTokenSendingStatusRemotePod {
    return wrapRemote(newApi_GetResetTokenSendingStatus(env.apiServerURL), remoteInfraError)
}
