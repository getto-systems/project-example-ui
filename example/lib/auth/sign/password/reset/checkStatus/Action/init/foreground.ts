import { newCheckSendingStatusMaterial } from "./common"

import { newCheckResetTokenSendingStatusLocationDetecter } from "../../impl/init"

import { toCheckResetTokenSendingStatusEntryPoint } from "../impl"

import { CheckResetTokenSendingStatusEntryPoint } from "../entryPoint"
import { initCheckResetTokenSendingStatusCoreAction } from "../Core/impl"

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
