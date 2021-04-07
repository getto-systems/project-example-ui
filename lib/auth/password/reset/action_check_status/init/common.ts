import {
    newCheckResetTokenSendingStatusInfra,
    newCheckResetTokenSendingStatusLocationDetecter,
} from "../../check_status/impl/init"

import {
    initCheckResetTokenSendingStatusCoreMaterial,
    initCheckResetTokenSendingStatusCoreMaterialPod,
} from "../core/impl"

import {
    CheckResetTokenSendingStatusCoreMaterial,
    CheckResetTokenSendingStatusCoreMaterialPod,
} from "../core/action"
import { RemoteOutsideFeature } from "../../../../../z_vendor/getto-application/infra/remote/infra"
import { LocationOutsideFeature } from "../../../../../z_vendor/getto-application/location/infra"

export function newCheckSendingStatusMaterial(
    feature: RemoteOutsideFeature & LocationOutsideFeature,
): CheckResetTokenSendingStatusCoreMaterial {
    return initCheckResetTokenSendingStatusCoreMaterial(
        newCheckResetTokenSendingStatusInfra(feature),
        newCheckResetTokenSendingStatusLocationDetecter(feature),
    )
}
export function newCheckSendingStatusMaterialPod(
    feature: RemoteOutsideFeature,
): CheckResetTokenSendingStatusCoreMaterialPod {
    return initCheckResetTokenSendingStatusCoreMaterialPod(
        newCheckResetTokenSendingStatusInfra(feature),
    )
}
