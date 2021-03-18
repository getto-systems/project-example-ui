import { newSendResetTokenRemote } from "../infra/remote/send_token"
import { newGetResetTokenSendingStatusRemote } from "../infra/remote/get_sending_status"

import { newLocationDetecter } from "../../../../../z_vendor/getto-application/location/init"

import { detectSessionID } from "./core"

import { limit, waitSecond } from "../../../../../z_vendor/getto-application/infra/config/infra"
import { CheckResetTokenSendingStatusInfra } from "../infra"

import { CheckResetTokenSendingStatusLocationDetecter } from "../method"

export function newCheckResetTokenSendingStatusLocationDetecter(
    currentLocation: Location,
): CheckResetTokenSendingStatusLocationDetecter {
    return newLocationDetecter(currentLocation, detectSessionID)
}

export function newCheckResetTokenSendingStatusInfra(): CheckResetTokenSendingStatusInfra {
    return {
        sendToken: newSendResetTokenRemote(),
        getStatus: newGetResetTokenSendingStatusRemote(),
        config: {
            wait: waitSecond(0.25),
            limit: limit(40),
        },
    }
}
