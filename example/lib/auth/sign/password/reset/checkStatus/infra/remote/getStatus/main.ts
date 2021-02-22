import { env } from "../../../../../../../../y_environment/env"

import { initApiAuthSignResetGetStatus } from "../../../../../../../../z_external/api/auth/sign/reset/getStatus"

import { initGetPasswordResetSendingStatusConnect } from "./connect"

import { GetPasswordResetSendingStatusRemote } from "../../../infra"

export function newGetPasswordResetSendingStatusRemote(): GetPasswordResetSendingStatusRemote {
    return initGetPasswordResetSendingStatusConnect(
        initApiAuthSignResetGetStatus(env.apiServerURL)
    )
}
