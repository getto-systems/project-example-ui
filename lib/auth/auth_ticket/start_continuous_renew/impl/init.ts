import { newAuthzRepository } from "../../kernel/infra/repository/authz"
import { newRenewAuthTicketRemote } from "../../kernel/infra/remote/renew"
import { newAuthnRepositoryPod } from "../../kernel/infra/repository/authn"

import { newClock } from "../../../../z_vendor/getto-application/infra/clock/init"

import {
    expireMinute,
    intervalMinute,
} from "../../../../z_vendor/getto-application/infra/config/infra"

import { StartContinuousRenewInfra } from "../infra"

export function newStartContinuousRenewAuthnInfoInfra(
    webStorage: Storage,
    webDB: IDBFactory,
    webCrypto: Crypto,
): StartContinuousRenewInfra {
    return {
        authz: newAuthzRepository(webStorage),
        authn: newAuthnRepositoryPod(webDB),
        renew: newRenewAuthTicketRemote(webCrypto),
        clock: newClock(),
        config: {
            authnExpire: expireMinute(1),
            interval: intervalMinute(2),
        },
    }
}
