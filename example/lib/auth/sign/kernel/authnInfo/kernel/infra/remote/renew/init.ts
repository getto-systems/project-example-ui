import { env } from "../../../../../../../../y_environment/env"

import { newApiAuthSignRenew } from "../../../../../../../../z_external/api/auth/sign/renew"

import { initRenewConnect } from "./connect"

import { RenewRemote } from "../../../infra"

export function newRenewAuthnInfoRemote(): RenewRemote {
    return initRenewConnect(newApiAuthSignRenew(env.apiServerURL))
}
