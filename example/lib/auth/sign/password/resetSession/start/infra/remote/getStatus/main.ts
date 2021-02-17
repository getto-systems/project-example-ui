import { env } from "../../../../../../../../y_environment/env"

import { initApiAuthSignResetGetStatus } from "../../../../../../../../z_external/api/auth/sign/reset/getStatus"

import { initGetPasswordResetSessionStatusConnect } from "./connect"

import { GetPasswordResetSessionStatusRemote } from "../../../infra"

export function newGetPasswordResetSessionStatusRemote(): GetPasswordResetSessionStatusRemote {
    return initGetPasswordResetSessionStatusConnect(
        initApiAuthSignResetGetStatus(env.apiServerURL)
    )
}
