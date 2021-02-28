import { newSendTokenRemote } from "./infra/remote/sendToken"
import { newGetSendingStatusRemote } from "./infra/remote/getSendingStatus"

import { initCheckSendingStatusLocationInfo } from "./impl"

import { limit, waitSecond } from "../../../../../z_vendor/getto-application/infra/config/infra"
import { CheckSendingStatusInfra } from "./infra"

import { CheckSendingStatusLocationInfo } from "./method"

export function newCheckSendingStatusLocationInfo(
    currentLocation: Location,
): CheckSendingStatusLocationInfo {
    return initCheckSendingStatusLocationInfo(new URL(currentLocation.toString()))
}

export function newCheckSendingStatusInfra(): CheckSendingStatusInfra {
    return {
        sendToken: newSendTokenRemote(),
        getStatus: newGetSendingStatusRemote(),
        config: {
            wait: waitSecond(0.25),
            limit: limit(40),
        },
    }
}
