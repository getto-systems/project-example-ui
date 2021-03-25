import { env } from "../../../../../../y_environment/env"

import { newApi_RequestToken } from "../../../../../../z_external/api/auth/password/reset/request_token"

import {
    remoteInfraError,
    wrapRemote,
} from "../../../../../../z_vendor/getto-application/infra/remote/helper"

import { RequestResetTokenRemotePod } from "../../infra"

export function newRequestResetTokenRemote(): RequestResetTokenRemotePod {
    return wrapRemote(newApi_RequestToken(env.apiServerURL), remoteInfraError)
}
