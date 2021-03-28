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

export function newCheckSendingStatusMaterial(
    webCrypto: Crypto,
    currentLocation: Location,
): CheckResetTokenSendingStatusCoreMaterial {
    return initCheckResetTokenSendingStatusCoreMaterial(
        newCheckResetTokenSendingStatusInfra(webCrypto),
        newCheckResetTokenSendingStatusLocationDetecter(currentLocation),
    )
}
export function newCheckSendingStatusMaterialPod(
    webCrypto: Crypto,
): CheckResetTokenSendingStatusCoreMaterialPod {
    return initCheckResetTokenSendingStatusCoreMaterialPod(
        newCheckResetTokenSendingStatusInfra(webCrypto),
    )
}
