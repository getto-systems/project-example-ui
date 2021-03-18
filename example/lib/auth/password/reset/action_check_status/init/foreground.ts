import { newCheckSendingStatusMaterial } from "./common"

import { newCheckResetTokenSendingStatusLocationDetecter } from "../../check_status/impl/init"

import { initCheckResetTokenSendingStatusView } from "../impl"

import { CheckResetTokenSendingStatusView } from "../resource"
import { initCheckResetTokenSendingStatusCoreAction } from "../core/impl"

type OutsideFeature = Readonly<{
    currentLocation: Location
}>
export function newCheckPasswordResetSendingStatus(
    feature: OutsideFeature,
): CheckResetTokenSendingStatusView {
    const { currentLocation } = feature
    return initCheckResetTokenSendingStatusView(
        initCheckResetTokenSendingStatusCoreAction(
            newCheckSendingStatusMaterial(
                newCheckResetTokenSendingStatusLocationDetecter(currentLocation),
            ),
        ),
    )
}
