import { newCheckSendingStatusMaterial } from "./common"

import { newCheckResetTokenSendingStatusLocationDetecter } from "../../check_status/impl/init"

import { toCheckResetTokenSendingStatusEntryPoint } from "../impl"

import { CheckResetTokenSendingStatusEntryPoint } from "../entry_point"
import { initCheckResetTokenSendingStatusCoreAction } from "../core/impl"

type OutsideFeature = Readonly<{
    currentLocation: Location
}>
export function newCheckPasswordResetSendingStatus(
    feature: OutsideFeature,
): CheckResetTokenSendingStatusEntryPoint {
    const { currentLocation } = feature
    return toCheckResetTokenSendingStatusEntryPoint(
        initCheckResetTokenSendingStatusCoreAction(
            newCheckSendingStatusMaterial(
                newCheckResetTokenSendingStatusLocationDetecter(currentLocation),
            ),
        ),
    )
}
