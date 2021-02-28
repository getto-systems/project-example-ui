import { env } from "../../../../../../../y_environment/env"

import { newApiGetSendingStatus } from "../../../../../../../z_external/api/auth/sign/password/reset/checkStatus/getSendingStatus"

import { wrapRemoteError } from "../../../../../../../z_vendor/getto-application/infra/remote/helper"

import { GetSendingStatusRemote } from "../../infra"

export function newGetSendingStatusRemote(): GetSendingStatusRemote {
    return wrapRemoteError(newApiGetSendingStatus(env.apiServerURL), (err) => ({
        type: "infra-error",
        err: `${err}`,
    }))
}
