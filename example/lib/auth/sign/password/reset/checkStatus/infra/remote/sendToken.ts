import { env } from "../../../../../../../y_environment/env"

import { newApiSendToken } from "../../../../../../../z_external/api/auth/sign/password/reset/checkStatus/sendToken"

import { wrapRemote } from "../../../../../../../z_vendor/getto-application/infra/remote/helper"

import { SendTokenRemotePod } from "../../infra"

export function newSendTokenRemote(): SendTokenRemotePod {
    return wrapRemote(newApiSendToken(env.apiServerURL), (err) => ({
        type: "infra-error",
        err: `${err}`,
    }))
}
