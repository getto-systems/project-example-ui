import { newSendTokenRemote } from "./infra/remote/sendToken"
import { newGetSendingStatusRemote } from "./infra/remote/getSendingStatus"

import { newLocationDetecter } from "../../../../../z_vendor/getto-application/location/init"

import { detectSessionID } from "./impl"

import { limit, waitSecond } from "../../../../../z_vendor/getto-application/infra/config/infra"
import { CheckSendingStatusInfra } from "./infra"

import { CheckSendingStatusLocationDetecter } from "./method"

import { authSignSearchParams } from "../../../common/search/data"

export function newCheckSendingStatusLocationDetecter(
    currentLocation: Location,
): CheckSendingStatusLocationDetecter {
    return newLocationDetecter(
        currentLocation,
        detectSessionID(authSignSearchParams.password.reset),
    )
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
