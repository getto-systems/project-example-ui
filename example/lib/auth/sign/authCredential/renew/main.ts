import { newApiCredentialRepository } from "../../../../common/apiCredential/infra/repository/main"
import { newAuthCredentialRepository } from "../common/infra/repository/main"
import { newRenewRemoteAccess } from "../common/infra/remote/renew/main"

import { initDateClock } from "../../../../z_infra/clock/date"
import { delayed } from "../../../../z_infra/delayed/core"

import { initRenewAction } from "./impl"

import { delaySecond, expireMinute } from "../../../../z_infra/time/infra"

import { RenewAction } from "./action"

export function newRenewActionPod(webStorage: Storage): RenewAction {
    return initRenewAction({
        apiCredentials: newApiCredentialRepository(webStorage),
        authCredentials: newAuthCredentialRepository(webStorage),
        renew: newRenewRemoteAccess(),
        config: {
            instantLoadExpire: expireMinute(3),
            delay: delaySecond(0.5),
        },
        delayed,
        clock: initDateClock(),
    })
}
