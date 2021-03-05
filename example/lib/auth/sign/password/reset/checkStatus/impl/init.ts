import { newSendResetTokenRemote } from "../infra/remote/sendToken"
import { newGetResetTokenSendingStatusRemote } from "../infra/remote/getSendingStatus"

import { newLocationDetecter } from "../../../../../../z_vendor/getto-application/location/init"

import { detectSessionID } from "./core"

import { limit, waitSecond } from "../../../../../../z_vendor/getto-application/infra/config/infra"
import { CheckResetTokenSendingStatusInfra } from "../infra"

import { CheckResetTokenSendingStatusLocationDetecter } from "../method"

import { signLinkParams } from "../../../../common/link/data"

export function newCheckSendingStatusLocationDetecter(
    currentLocation: Location,
): CheckResetTokenSendingStatusLocationDetecter {
    return newLocationDetecter(
        currentLocation,
        detectSessionID(signLinkParams.password.reset),
    )
}

export function newCheckSendingStatusInfra(): CheckResetTokenSendingStatusInfra {
    return {
        sendToken: newSendResetTokenRemote(),
        getStatus: newGetResetTokenSendingStatusRemote(),
        config: {
            wait: waitSecond(0.25),
            limit: limit(40),
        },
    }
}
