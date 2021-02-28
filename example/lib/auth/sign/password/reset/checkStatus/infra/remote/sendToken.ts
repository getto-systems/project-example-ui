import { env } from "../../../../../../../y_environment/env"

import { newApiSendToken } from "../../../../../../../z_external/api/auth/sign/password/reset/checkStatus/sendToken"

import { wrapRemoteError } from "../../../../../../../z_vendor/getto-application/infra/remote/helper"

import { SendTokenRemote } from "../../infra"

export function newSendTokenRemote(): SendTokenRemote {
    return wrapRemoteError(newApiSendToken(env.apiServerURL), (err) => ({
        type: "infra-error",
        err: `${err}`,
    }))
}
