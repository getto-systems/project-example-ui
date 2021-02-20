import { newApiCredentialRepository } from "../../../../../common/apiCredential/infra/repository/main"
import { newAuthnInfoRepository } from "../kernel/infra/repository/authnInfo/main"
import { newRenewAuthnInfoRemote } from "../kernel/infra/remote/renew/main"

import { newClock } from "../../../../../z_getto/infra/clock/main"
import { delayed } from "../../../../../z_getto/infra/delayed/core"

import { delaySecond, expireMinute } from "../../../../../z_getto/infra/config/infra"
import { RenewAuthnInfoInfra } from "./infra"

export function newRenewAuthnInfoInfra(webStorage: Storage): RenewAuthnInfoInfra {
    return {
        apiCredentials: newApiCredentialRepository(webStorage),
        authnInfos: newAuthnInfoRepository(webStorage),
        renew: newRenewAuthnInfoRemote(),
        clock: newClock(),
        delayed,
        config: {
            instantLoadExpire: expireMinute(3),
            delay: delaySecond(0.5),
        },
    }
}
