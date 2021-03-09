import { env } from "../../../../../../../y_environment/env"

import { newApi_RequestToken } from "../../../../../../../z_external/api/auth/sign/password/reset/request_token"

import { wrapRemote } from "../../../../../../../z_vendor/getto-application/infra/remote/helper"

import { RequestResetTokenRemotePod } from "../../infra"

export function newRequestResetTokenRemote(): RequestResetTokenRemotePod {
    return wrapRemote(newApi_RequestToken(env.apiServerURL), (err) => ({
        type: "infra-error",
        err: `${err}`,
    }))
}
