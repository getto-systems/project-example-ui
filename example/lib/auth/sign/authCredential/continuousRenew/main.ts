import { newApiCredentialRepository } from "../../../../common/apiCredential/infra/repository/main"
import { newAuthCredentialRepository } from "../common/infra/repository/main"
import { newRenewRemoteAccess } from "../common/infra/remote/renew/main"

import { initDateClock } from "../../../../z_infra/clock/date"

import { initContinuousRenewAction } from "./impl"

import { delayMinute, intervalMinute } from "../../../../z_infra/time/infra"

import { ContinuousRenewAction } from "./action"

export function newContinuousRenewAction(webStorage: Storage): ContinuousRenewAction {
    return initContinuousRenewAction({
        apiCredentials: newApiCredentialRepository(webStorage),
        authCredentials: newAuthCredentialRepository(webStorage),
        renew: newRenewRemoteAccess(),
        config: {
            delay: delayMinute(1),
            interval: intervalMinute(2),
        },
        clock: initDateClock(),
    })
}
