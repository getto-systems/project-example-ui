import { env } from "../../../../../../../y_environment/env"

import { initApiAuthSignRenew } from "../../../../../../../z_external/api/auth/sign/renew"

import { initRenewAuthCredentialConnectRemoteAccess } from "./connect"

import { RenewAuthCredentialRemoteAccess } from "../../../infra"

export function newRenewAuthCredentialRemoteAccess(): RenewAuthCredentialRemoteAccess {
    return initRenewAuthCredentialConnectRemoteAccess(initApiAuthSignRenew(env.apiServerURL))
}
