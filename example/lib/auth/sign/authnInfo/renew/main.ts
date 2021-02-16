import { newApiCredentialRepository } from "../../../../common/apiCredential/infra/repository/main"
import { newAuthnInfoRepository } from "../common/infra/repository/authnInfo/main"
import { newRenewAuthnInfoRemoteAccess } from "../common/infra/remote/renew/main"

import { newDateClock } from "../../../../z_infra/clock/date"
import { delayed } from "../../../../z_infra/delayed/core"

import { delaySecond, expireMinute } from "../../../../z_infra/time/infra"
import { RenewAuthnInfoInfra } from "./infra"

export function newRenewAuthnInfoInfra(webStorage: Storage): RenewAuthnInfoInfra {
    return {
        apiCredentials: newApiCredentialRepository(webStorage),
        authnInfos: newAuthnInfoRepository(webStorage),
        renew: newRenewAuthnInfoRemoteAccess(),
        clock: newDateClock(),
        delayed,
        config: {
            instantLoadExpire: expireMinute(3),
            delay: delaySecond(0.5),
        },
    }
}
