import { env } from "../../../../../../../y_environment/env"

import { newApiRequestToken } from "../../../../../../../z_external/api/auth/sign/password/reset/requestToken"

import { wrapRemote } from "../../../../../../../z_vendor/getto-application/infra/remote/helper"

import { RequestResetTokenRemotePod } from "../../infra"

export function newRequestResetTokenRemote(): RequestResetTokenRemotePod {
    return wrapRemote(newApiRequestToken(env.apiServerURL), (err) => ({
        type: "infra-error",
        err: `${err}`,
    }))
}
