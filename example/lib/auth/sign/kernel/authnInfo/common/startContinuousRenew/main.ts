import { newApiCredentialRepository } from "../../../../../../common/apiCredential/infra/repository/main"
import { newAuthnInfoRepository } from "../../kernel/infra/repository/authnInfo/main"
import { newRenewAuthnInfoRemote } from "../../kernel/infra/remote/renew/main"

import { newDateClock } from "../../../../../../z_infra/clock/date"

import { delayMinute, intervalMinute } from "../../../../../../z_infra/time/infra"

import { StartContinuousRenewAuthnInfoInfra } from "./infra"

export function newStartContinuousRenewAuthnInfoInfra(
    webStorage: Storage
): StartContinuousRenewAuthnInfoInfra {
    return {
        apiCredentials: newApiCredentialRepository(webStorage),
        authnInfos: newAuthnInfoRepository(webStorage),
        renew: newRenewAuthnInfoRemote(),
        clock: newDateClock(),
        config: {
            delay: delayMinute(1),
            interval: intervalMinute(2),
        },
    }
}
