import { env } from "../../../../../../../y_environment/env"

import { newApiRequestToken } from "../../../../../../../z_external/api/auth/sign/password/reset/requestToken"

import { wrapRemoteError } from "../../../../../../../z_vendor/getto-application/infra/remote/helper"

import { RequestTokenRemote } from "../../infra"

export function newRequestTokenRemote(): RequestTokenRemote {
    return wrapRemoteError(newApiRequestToken(env.apiServerURL), (err) => ({
        type: "infra-error",
        err: `${err}`,
    }))
}
