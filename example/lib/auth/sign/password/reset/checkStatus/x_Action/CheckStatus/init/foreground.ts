import { newCheckSendingStatusMaterial } from "./common"

import { newCheckSendingStatusLocationDetecter } from "../../../init"

import { initCheckSendingStatusAction, toEntryPoint } from "../impl"

import { CheckPasswordResetSendingStatusEntryPoint } from "../action"

export function newCheckPasswordResetSendingStatus(
    currentLocation: Location,
): CheckPasswordResetSendingStatusEntryPoint {
    return toEntryPoint(
        initCheckSendingStatusAction(
            newCheckSendingStatusMaterial(newCheckSendingStatusLocationDetecter(currentLocation)),
        ),
    )
}
