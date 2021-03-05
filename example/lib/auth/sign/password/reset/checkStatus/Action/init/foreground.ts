import { newCheckSendingStatusMaterial } from "./common"

import { newCheckSendingStatusLocationDetecter } from "../../impl/init"

import { toCheckResetTokenSendingStatusEntryPoint } from "../impl"

import { CheckResetTokenSendingStatusEntryPoint } from "../entryPoint"
import { initCheckResetTokenSendingStatusCoreAction } from "../Core/impl"

export function newCheckPasswordResetSendingStatus(
    currentLocation: Location,
): CheckResetTokenSendingStatusEntryPoint {
    return toCheckResetTokenSendingStatusEntryPoint(
        initCheckResetTokenSendingStatusCoreAction(
            newCheckSendingStatusMaterial(newCheckSendingStatusLocationDetecter(currentLocation)),
        ),
    )
}
