import { env } from "../../../../../../../y_environment/env"

import { initApiAuthSignResetGetStatus } from "../../../../../../../z_external/api/auth/sign/reset/getStatus"

import { unwrapRemoteError } from "../../../../../../../z_vendor/getto-application/infra/remote/helper"

import { GetSendingStatusRemote } from "../../infra"

export function newGetSendingStatusRemote(): GetSendingStatusRemote {
    return unwrapRemoteError(initApiAuthSignResetGetStatus(env.apiServerURL), (err) => ({
        type: "infra-error",
        err: `${err}`,
    }))
}
