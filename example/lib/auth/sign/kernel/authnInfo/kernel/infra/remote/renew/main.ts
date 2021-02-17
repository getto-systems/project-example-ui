import { env } from "../../../../../../../../y_environment/env"

import { newApiAuthSignRenew } from "../../../../../../../../z_external/api/auth/sign/renew"

import { initRenewAuthnInfoConnect } from "./connect"

import { RenewAuthnInfoRemote } from "../../../infra"

export function newRenewAuthnInfoRemote(): RenewAuthnInfoRemote {
    return initRenewAuthnInfoConnect(newApiAuthSignRenew(env.apiServerURL))
}
