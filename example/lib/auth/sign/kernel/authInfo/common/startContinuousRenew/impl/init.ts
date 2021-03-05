import { newAuthzRepository } from "../../../../../../../common/authz/infra/repository/authz"
import { newRenewAuthInfoRemote } from "../../../kernel/infra/remote/renew"
import { newLastAuthRepository } from "../../../kernel/infra/repository/lastAuth"

import { newClock } from "../../../../../../../z_vendor/getto-application/infra/clock/init"

import {
    expireMinute,
    intervalMinute,
} from "../../../../../../../z_vendor/getto-application/infra/config/infra"

import { StartContinuousRenewInfra } from "../infra"

export function newStartContinuousRenewAuthnInfoInfra(
    webStorage: Storage,
): StartContinuousRenewInfra {
    return {
        authz: newAuthzRepository(webStorage),
        lastAuth: newLastAuthRepository(webStorage),
        renew: newRenewAuthInfoRemote(),
        clock: newClock(),
        config: {
            lastAuthExpire: expireMinute(1),
            interval: intervalMinute(2),
        },
    }
}
