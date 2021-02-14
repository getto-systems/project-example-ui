import { env } from "../../../../../../../../y_environment/env"

import { initApiAuthSignResetGetStatus } from "../../../../../../../../z_external/api/auth/sign/reset/getStatus"

import { initGetStatusConnectRemoteAccess } from "./connect"

import { GetStatusRemoteAccess } from "../../../infra"

export function newGetStatusRemoteAccess(): GetStatusRemoteAccess {
    return initGetStatusConnectRemoteAccess(initApiAuthSignResetGetStatus(env.apiServerURL))
}
