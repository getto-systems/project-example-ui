import { newAuthnRepositoryPod } from "../../kernel/infra/repository/authn"
import { newAuthzRepositoryPod } from "../../kernel/infra/repository/authz"
import { newRenewAuthTicketRemote } from "../../kernel/infra/remote/renew"

import { newClock } from "../../../../z_vendor/getto-application/infra/clock/init"

import {
    delaySecond,
    expireMinute,
} from "../../../../z_vendor/getto-application/infra/config/infra"
import { CheckAuthTicketInfra } from "../infra"
import { RemoteOutsideFeature } from "../../../../z_vendor/getto-application/infra/remote/infra"
import { RepositoryOutsideFeature } from "../../../../z_vendor/getto-application/infra/repository/infra"

type OutsideFeature = RepositoryOutsideFeature & RemoteOutsideFeature
export function newCheckAuthTicketInfra(
    feature: OutsideFeature,
): CheckAuthTicketInfra {
    return {
        authz: newAuthzRepositoryPod(feature),
        authn: newAuthnRepositoryPod(feature),
        renew: newRenewAuthTicketRemote(feature),
        clock: newClock(),
        config: {
            instantLoadExpire: expireMinute(3),
            takeLongtimeThreshold: delaySecond(0.5),
        },
    }
}
