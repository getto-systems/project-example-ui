import { newCheckSendingStatusMaterial } from "./common"

import { initCheckResetTokenSendingStatusView } from "../impl"

import { CheckResetTokenSendingStatusView } from "../resource"
import { initCheckResetTokenSendingStatusCoreAction } from "../core/impl"

type OutsideFeature = Readonly<{
    webCrypto: Crypto
    currentLocation: Location
}>
export function newCheckPasswordResetSendingStatus(
    feature: OutsideFeature,
): CheckResetTokenSendingStatusView {
    const { webCrypto, currentLocation } = feature
    return initCheckResetTokenSendingStatusView(
        initCheckResetTokenSendingStatusCoreAction(
            newCheckSendingStatusMaterial(webCrypto, currentLocation),
        ),
    )
}
