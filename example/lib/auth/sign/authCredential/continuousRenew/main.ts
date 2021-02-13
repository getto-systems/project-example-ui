import { newApiCredentialRepository } from "../../../../common/auth/apiCredential/infra/repository/main"
import { newAuthCredentialRepository } from "../common/infra/repository/main"
import { newRenewRemoteAccess } from "../common/infra/remote/renew/main"

import { initDateClock } from "../../../../z_infra/clock/date"

import { initContinuousRenewActionPod } from "./impl"

import { delayMinute, intervalMinute } from "../../../../z_infra/time/infra"

import { ContinuousRenewActionPod } from "./action"

export function newContinuousRenewActionPod(webStorage: Storage): ContinuousRenewActionPod {
    return initContinuousRenewActionPod({
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
