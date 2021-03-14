import { newAuthzRepository } from "../../kernel/infra/repository/authz"
import { newRenewAuthTicketRemote } from "../../kernel/infra/remote/renew"
import { newAuthnRepository } from "../../kernel/infra/repository/last_auth"

import { newClock } from "../../../../../z_vendor/getto-application/infra/clock/init"

import {
    expireMinute,
    intervalMinute,
} from "../../../../../z_vendor/getto-application/infra/config/infra"

import { StartContinuousRenewInfra } from "../infra"

export function newStartContinuousRenewAuthnInfoInfra(
    webStorage: Storage,
): StartContinuousRenewInfra {
    return {
        authz: newAuthzRepository(webStorage),
        authn: newAuthnRepository(webStorage),
        renew: newRenewAuthTicketRemote(),
        clock: newClock(),
        config: {
            authnExpire: expireMinute(1),
            interval: intervalMinute(2),
        },
    }
}
