import { env } from "../../../../../../../y_environment/env"

import { initApiAuthSignRenew } from "../../../../../../../z_external/api/auth/sign/renew"

import { initRenewConnectRemoteAccess } from "./connect"

import { RenewRemoteAccess } from "../../../infra"

export function newRenewRemoteAccess(): RenewRemoteAccess {
    return initRenewConnectRemoteAccess(initApiAuthSignRenew(env.apiServerURL))
}
