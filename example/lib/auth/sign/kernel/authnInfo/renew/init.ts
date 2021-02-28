import { newAuthnInfoRepository } from "../kernel/infra/repository/authnInfo/init"
import { newAuthzRepository } from "../../../../../common/authz/infra/repository/authz"
import { newRenewAuthnInfoRemote } from "../kernel/infra/remote/renew/init"

import { newClock } from "../../../../../z_vendor/getto-application/infra/clock/init"

import {
    delaySecond,
    expireMinute,
} from "../../../../../z_vendor/getto-application/infra/config/infra"
import { RenewInfra } from "./infra"

export function newRenewInfra(webStorage: Storage): RenewInfra {
    return {
        authz: newAuthzRepository(webStorage),
        authnInfos: newAuthnInfoRepository(webStorage),
        renew: newRenewAuthnInfoRemote(),
        clock: newClock(),
        config: {
            instantLoadExpire: expireMinute(3),
            delay: delaySecond(0.5),
        },
    }
}
