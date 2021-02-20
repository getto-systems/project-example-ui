import { newApiCredentialRepository } from "../../../../../../common/apiCredential/infra/repository/main"
import { newAuthnInfoRepository } from "../../kernel/infra/repository/authnInfo/main"
import { newRenewAuthnInfoRemote } from "../../kernel/infra/remote/renew/main"

import { newClock } from "../../../../../../z_getto/infra/clock/main"

import { delayMinute, intervalMinute } from "../../../../../../z_getto/infra/config/infra"

import { StartContinuousRenewAuthnInfoInfra } from "./infra"

export function newStartContinuousRenewAuthnInfoInfra(
    webStorage: Storage
): StartContinuousRenewAuthnInfoInfra {
    return {
        apiCredentials: newApiCredentialRepository(webStorage),
        authnInfos: newAuthnInfoRepository(webStorage),
        renew: newRenewAuthnInfoRemote(),
        clock: newClock(),
        config: {
            delay: delayMinute(1),
            interval: intervalMinute(2),
        },
    }
}
