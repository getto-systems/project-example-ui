import { newAuthzRepository } from "../../../../../../common/authz/infra/repository/authz"
import { newRenewRemote } from "../../kernel/infra/remote/renew"
import { newLastAuthRepository } from "../../kernel/infra/repository/lastAuth"

import { newClock } from "../../../../../../z_vendor/getto-application/infra/clock/init"

import {
    delayMinute,
    intervalMinute,
} from "../../../../../../z_vendor/getto-application/infra/config/infra"

import { StartContinuousRenewInfra } from "./infra"

export function newStartContinuousRenewAuthnInfoInfra(
    webStorage: Storage,
): StartContinuousRenewInfra {
    return {
        authz: newAuthzRepository(webStorage),
        lastAuth: newLastAuthRepository(webStorage),
        renew: newRenewRemote(),
        clock: newClock(),
        config: {
            delay: delayMinute(1),
            interval: intervalMinute(2),
        },
    }
}
