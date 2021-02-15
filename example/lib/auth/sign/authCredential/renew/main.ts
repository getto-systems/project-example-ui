import { newApiCredentialRepository } from "../../../../common/apiCredential/infra/repository/main"
import { newAuthCredentialRepository } from "../common/infra/repository/authCredential/main"
import { newRenewAuthCredentialRemoteAccess } from "../common/infra/remote/renewAuthCredential/main"

import { initDateClock } from "../../../../z_infra/clock/date"
import { delayed } from "../../../../z_infra/delayed/core"

import { initRenewAuthCredentialAction } from "./impl"

import { delaySecond, expireMinute } from "../../../../z_infra/time/infra"

import { RenewAuthCredentialAction } from "./action"

export function newRenewAuthCredentialActionPod(webStorage: Storage): RenewAuthCredentialAction {
    return initRenewAuthCredentialAction({
        apiCredentials: newApiCredentialRepository(webStorage),
        authCredentials: newAuthCredentialRepository(webStorage),
        renew: newRenewAuthCredentialRemoteAccess(),
        config: {
            instantLoadExpire: expireMinute(3),
            delay: delaySecond(0.5),
        },
        delayed,
        clock: initDateClock(),
    })
}
