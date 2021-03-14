import { newCheckSendingStatusMaterial } from "./common"

import { newCheckResetTokenSendingStatusLocationDetecter } from "../../check_status/impl/init"

import { initCheckResetTokenSendingStatusEntryPoint } from "../impl"

import { CheckResetTokenSendingStatusEntryPoint } from "../entry_point"
import { initCheckResetTokenSendingStatusCoreAction } from "../core/impl"

type OutsideFeature = Readonly<{
    currentLocation: Location
}>
export function newCheckPasswordResetSendingStatus(
    feature: OutsideFeature,
): CheckResetTokenSendingStatusEntryPoint {
    const { currentLocation } = feature
    return initCheckResetTokenSendingStatusEntryPoint(
        initCheckResetTokenSendingStatusCoreAction(
            newCheckSendingStatusMaterial(
                newCheckResetTokenSendingStatusLocationDetecter(currentLocation),
            ),
        ),
    )
}
