import { newAuthzRepository } from "../../../../../common/authz/infra/repository/authz"
import { newRenewRemote } from "../kernel/infra/remote/renew"

import { newClock } from "../../../../../z_vendor/getto-application/infra/clock/init"

import {
    delaySecond,
    expireMinute,
} from "../../../../../z_vendor/getto-application/infra/config/infra"
import { CheckAuthInfoInfra } from "./infra"
import { newLastAuthRepository } from "../kernel/infra/repository/lastAuth"

export function newCheckAuthInfoInfra(webStorage: Storage): CheckAuthInfoInfra {
    return {
        authz: newAuthzRepository(webStorage),
        lastAuth: newLastAuthRepository(webStorage),
        renew: newRenewRemote(),
        clock: newClock(),
        config: {
            instantLoadExpire: expireMinute(3),
            delay: delaySecond(0.5),
        },
    }
}
