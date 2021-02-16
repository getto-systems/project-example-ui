import { newApiCredentialRepository } from "../../../../common/apiCredential/infra/repository/main"
import { newAuthnInfoRepository } from "../common/infra/repository/authnInfo/main"
import { newRenewAuthnInfoRemoteAccess } from "../common/infra/remote/renew/main"

import { newDateClock } from "../../../../z_infra/clock/date"

import { delayMinute, intervalMinute } from "../../../../z_infra/time/infra"

import { StartContinuousRenewAuthnInfoInfra } from "./infra"

export function newStartContinuousRenewAuthnInfoInfra(
    webStorage: Storage
): StartContinuousRenewAuthnInfoInfra {
    return {
        apiCredentials: newApiCredentialRepository(webStorage),
        authnInfos: newAuthnInfoRepository(webStorage),
        renew: newRenewAuthnInfoRemoteAccess(),
        clock: newDateClock(),
        config: {
            delay: delayMinute(1),
            interval: intervalMinute(2),
        },
    }
}
