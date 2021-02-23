import { newCheckSendingStatusMaterial } from "./common"

import { newCheckSendingStatusLocationInfo } from "../../../init"

import { initCheckSendingStatusAction, toEntryPoint } from "../impl"

import { CheckPasswordResetSendingStatusEntryPoint } from "../action"

export function newCheckPasswordResetSendingStatus(
    currentLocation: Location,
): CheckPasswordResetSendingStatusEntryPoint {
    return toEntryPoint(
        initCheckSendingStatusAction(
            newCheckSendingStatusMaterial(newCheckSendingStatusLocationInfo(currentLocation)),
        ),
    )
}
