import { limit, waitSecond } from "../../../../../../../../z_getto/infra/config/infra"
import { wait } from "../../../../../../../../z_getto/infra/delayed/core"
import { newCheckPasswordResetSendingStatusLocationInfo } from "../../../impl"
import { newGetPasswordResetSendingStatusRemote } from "../../../infra/remote/getStatus/main"
import { newSendPasswordResetTokenRemote } from "../../../infra/remote/sendToken/main"
import { CheckPasswordResetSendingStatusLocationInfo } from "../../../method"
import {
    CheckPasswordResetSendingStatusAction,
    CheckPasswordResetSendingStatusEntryPoint,
    CheckPasswordResetSendingStatusMaterialPod,
} from "../action"
import {
    CheckPasswordResetSendingStatusBase,
    initCheckPasswordResetSendingStatusAction,
    initCheckPasswordResetSendingStatusAction_merge,
    initCheckPasswordResetSendingStatusMaterialPod,
    toCheckPasswordResetSendingStatusEntryPoint,
} from "../impl"

export function newCheckPasswordResetSendingStatus(
    currentURL: URL,
): CheckPasswordResetSendingStatusEntryPoint {
    return toCheckPasswordResetSendingStatusEntryPoint(
        newAction(newCheckPasswordResetSendingStatusLocationInfo(currentURL)),
    )
}
export function newCheckPasswordResetSendingStatus_proxy(
    currentURL: URL,
    pod: CheckPasswordResetSendingStatusMaterialPod,
): CheckPasswordResetSendingStatusEntryPoint {
    return toCheckPasswordResetSendingStatusEntryPoint(
        initCheckPasswordResetSendingStatusAction_merge(
            pod,
            newCheckPasswordResetSendingStatusLocationInfo(currentURL),
        ),
    )
}

export function newCheckPasswordResetSendingStatusMaterialPod(): CheckPasswordResetSendingStatusMaterialPod {
    return initCheckPasswordResetSendingStatusMaterialPod(newBase())
}

function newAction(
    locationInfo: CheckPasswordResetSendingStatusLocationInfo,
): CheckPasswordResetSendingStatusAction {
    return initCheckPasswordResetSendingStatusAction(newBase(), locationInfo)
}

function newBase(): CheckPasswordResetSendingStatusBase {
    return {
        checkStatus: {
            sendToken: newSendPasswordResetTokenRemote(),
            getStatus: newGetPasswordResetSendingStatusRemote(),
            config: {
                wait: waitSecond(0.25),
                limit: limit(40),
            },
            wait,
        },
    }
}
