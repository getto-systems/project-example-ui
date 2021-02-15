import { newApiCredentialRepository } from "../../../../common/apiCredential/infra/repository/main"
import { newAuthCredentialRepository } from "../common/infra/repository/authCredential/main"
import { newRenewAuthCredentialRemoteAccess } from "../common/infra/remote/renewAuthCredential/main"

import { initDateClock } from "../../../../z_infra/clock/date"

import { initContinuousRenewAuthCredentialAction } from "./impl"

import { delayMinute, intervalMinute } from "../../../../z_infra/time/infra"

import { ContinuousRenewAuthCredentialAction } from "./action"

export function newContinuousRenewAuthCredentialAction(
    webStorage: Storage
): ContinuousRenewAuthCredentialAction {
    return initContinuousRenewAuthCredentialAction({
        apiCredentials: newApiCredentialRepository(webStorage),
        authCredentials: newAuthCredentialRepository(webStorage),
        renew: newRenewAuthCredentialRemoteAccess(),
        config: {
            delay: delayMinute(1),
            interval: intervalMinute(2),
        },
        clock: initDateClock(),
    })
}
