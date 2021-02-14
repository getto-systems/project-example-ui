import { env } from "../../../../../../../../y_environment/env"

import { initApiAuthSignResetStartSession } from "../../../../../../../../z_external/api/auth/sign/reset/startSession"

import { initStartSessionConnectRemoteAccess } from "./connect"

import { StartSessionRemoteAccess } from "../../../infra"

export function newStartSessionRemoteAccess(): StartSessionRemoteAccess {
    return initStartSessionConnectRemoteAccess(initApiAuthSignResetStartSession(env.apiServerURL))
}
