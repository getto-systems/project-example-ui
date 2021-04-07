import { newCheckSendingStatusMaterial } from "./common"

import { initCheckResetTokenSendingStatusView } from "../impl"

import { CheckResetTokenSendingStatusView } from "../resource"
import { initCheckResetTokenSendingStatusCoreAction } from "../core/impl"
import { RemoteOutsideFeature } from "../../../../../z_vendor/getto-application/infra/remote/infra"
import { LocationOutsideFeature } from "../../../../../z_vendor/getto-application/location/infra"

export function newCheckPasswordResetSendingStatus(
    feature: RemoteOutsideFeature & LocationOutsideFeature,
): CheckResetTokenSendingStatusView {
    return initCheckResetTokenSendingStatusView(
        initCheckResetTokenSendingStatusCoreAction(newCheckSendingStatusMaterial(feature)),
    )
}
