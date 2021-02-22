import { env } from "../../../../../../../../y_environment/env"

import { initApiAuthSignResetSendToken } from "../../../../../../../../z_external/api/auth/sign/reset/sendToken"

import { initSendPasswordResetTokenConnect } from "./connect"

import { SendPasswordResetTokenRemote } from "../../../infra"

export function newSendPasswordResetTokenRemote(): SendPasswordResetTokenRemote {
    return initSendPasswordResetTokenConnect(initApiAuthSignResetSendToken(env.apiServerURL))
}
