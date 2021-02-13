import { env } from "../../../../../../../y_environment/env"

import { initApiAuthRenew } from "../../../../../../../z_external/api/auth/renew"

import { initRenewConnectRemoteAccess } from "./connect"

import { RenewRemoteAccess } from "../../../infra"

export function newRenewRemoteAccess(): RenewRemoteAccess {
    return initRenewConnectRemoteAccess(initApiAuthRenew(env.apiServerURL))
}
