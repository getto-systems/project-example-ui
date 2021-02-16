import { newApiCredentialRepository } from "../../../../common/apiCredential/infra/repository/main"
import { newAuthnInfoRepository } from "../common/infra/repository/authnInfo/main"
import { newRenewAuthnInfoRemoteAccess } from "../common/infra/remote/renew/main"

import { newDateClock } from "../../../../z_infra/clock/date"

import { initStartContinuousRenewAuthnInfoAction } from "./impl"

import { delayMinute, intervalMinute } from "../../../../z_infra/time/infra"

import { StartContinuousRenewAuthnInfoAction } from "./action"
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

export function newContinuousRenewAuthnInfoAction(
    webStorage: Storage
): StartContinuousRenewAuthnInfoAction {
    return initStartContinuousRenewAuthnInfoAction({
        apiCredentials: newApiCredentialRepository(webStorage),
        authnInfos: newAuthnInfoRepository(webStorage),
        renew: newRenewAuthnInfoRemoteAccess(),
        config: {
            delay: delayMinute(1),
            interval: intervalMinute(2),
        },
        clock: newDateClock(),
    })
}
