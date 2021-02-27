import { newApiCredentialRepository } from "../../../../../common/apiCredential/infra/repository/main"
import { newAuthnInfoRepository } from "../kernel/infra/repository/authnInfo/init"
import { newRenewAuthnInfoRemote } from "../kernel/infra/remote/renew/init"

import { newClock } from "../../../../../z_vendor/getto-application/infra/clock/init"

import {
    delaySecond,
    expireMinute,
} from "../../../../../z_vendor/getto-application/infra/config/infra"
import { RenewInfra } from "./infra"

export function newRenewInfra(webStorage: Storage): RenewInfra {
    return {
        apiCredentials: newApiCredentialRepository(webStorage),
        authnInfos: newAuthnInfoRepository(webStorage),
        renew: newRenewAuthnInfoRemote(),
        clock: newClock(),
        config: {
            instantLoadExpire: expireMinute(3),
            delay: delaySecond(0.5),
        },
    }
}
