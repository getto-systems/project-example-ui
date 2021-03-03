import { env } from "../../../../../../../y_environment/env"

import { newApiGetSendingStatus } from "../../../../../../../z_external/api/auth/sign/password/reset/checkStatus/getSendingStatus"

import { wrapRemote } from "../../../../../../../z_vendor/getto-application/infra/remote/helper"

import { GetSendingStatusRemotePod } from "../../infra"

export function newGetSendingStatusRemote(): GetSendingStatusRemotePod {
    return wrapRemote(newApiGetSendingStatus(env.apiServerURL), (err) => ({
        type: "infra-error",
        err: `${err}`,
    }))
}
