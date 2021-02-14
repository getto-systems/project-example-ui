import { env } from "../../../../../../../../y_environment/env"

import { initApiAuthSignResetSendToken } from "../../../../../../../../z_external/api/auth/sign/reset/sendToken"

import { initSendTokenConnectRemoteAccess } from "./connect"

import { SendTokenRemoteAccess } from "../../../infra"

export function newSendTokenRemoteAccess(): SendTokenRemoteAccess {
    return initSendTokenConnectRemoteAccess(initApiAuthSignResetSendToken(env.apiServerURL))
}
