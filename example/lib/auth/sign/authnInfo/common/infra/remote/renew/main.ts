import { env } from "../../../../../../../y_environment/env"

import { newApiAuthSignRenew } from "../../../../../../../z_external/api/auth/sign/renew"

import { initRenewAuthnInfoConnectRemoteAccess } from "./connect"

import { RenewAuthnInfoRemoteAccess } from "../../../infra"

export function newRenewAuthnInfoRemoteAccess(): RenewAuthnInfoRemoteAccess {
    return initRenewAuthnInfoConnectRemoteAccess(
        newApiAuthSignRenew(env.apiServerURL)
    )
}
