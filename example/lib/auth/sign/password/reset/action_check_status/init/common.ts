import { newCheckResetTokenSendingStatusInfra } from "../../check_status/impl/init"

import {
    initCheckResetTokenSendingStatusCoreMaterial,
    initCheckResetTokenSendingStatusCoreMaterialPod,
} from "../core/impl"

import {
    CheckResetTokenSendingStatusCoreMaterial,
    CheckResetTokenSendingStatusCoreMaterialPod,
} from "../core/action"

import { CheckResetTokenSendingStatusLocationDetecter } from "../../check_status/method"

export function newCheckSendingStatusMaterial(
    detecter: CheckResetTokenSendingStatusLocationDetecter,
): CheckResetTokenSendingStatusCoreMaterial {
    return initCheckResetTokenSendingStatusCoreMaterial(newCheckResetTokenSendingStatusInfra(), detecter)
}
export function newCheckSendingStatusMaterialPod(): CheckResetTokenSendingStatusCoreMaterialPod {
    return initCheckResetTokenSendingStatusCoreMaterialPod(newCheckResetTokenSendingStatusInfra())
}
