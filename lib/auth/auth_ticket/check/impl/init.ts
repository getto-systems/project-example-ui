import { newAuthzRepository } from "../../kernel/infra/repository/authz"
import { newRenewAuthTicketRemote } from "../../kernel/infra/remote/renew"

import { newClock } from "../../../../z_vendor/getto-application/infra/clock/init"

import {
    delaySecond,
    expireMinute,
} from "../../../../z_vendor/getto-application/infra/config/infra"
import { CheckAuthTicketInfra } from "../infra"
import { newAuthnRepositoryPod } from "../../kernel/infra/repository/authn"

export function newCheckAuthTicketInfra(
    webDB: IDBFactory,
    webCrypto: Crypto,
): CheckAuthTicketInfra {
    return {
        authz: newAuthzRepository(webDB),
        authn: newAuthnRepositoryPod(webDB),
        renew: newRenewAuthTicketRemote(webCrypto),
        clock: newClock(),
        config: {
            instantLoadExpire: expireMinute(3),
            takeLongtimeThreshold: delaySecond(0.5),
        },
    }
}
