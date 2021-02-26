import { env } from "../../../../../y_environment/env"

import { initApiAuthSignResetGetStatus } from "../../../../../z_external/api/auth/sign/reset/getStatus"
import { initApiAuthSignResetSendToken } from "../../../../../z_external/api/auth/sign/reset/sendToken"

import { ticker } from "../../../../../z_vendor/getto-application/infra/timer/impl"
import { initGetSendingStatusConnect } from "./infra/remote/getSendingStatus/connect"
import { initSendTokenConnect } from "./infra/remote/sendToken/connect"

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
        sendToken: initSendTokenConnect(initApiAuthSignResetSendToken(env.apiServerURL)),
        getStatus: initGetSendingStatusConnect(initApiAuthSignResetGetStatus(env.apiServerURL)),
        config: {
            wait: waitSecond(0.25),
            limit: limit(40),
        },
        wait: ticker,
    }
}
