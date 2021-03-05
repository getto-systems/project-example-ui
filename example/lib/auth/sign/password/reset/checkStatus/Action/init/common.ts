import { newCheckSendingStatusInfra } from "../../impl/init"

import {
    initCheckResetTokenSendingStatusCoreMaterial,
    initCheckResetTokenSendingStatusCoreMaterialPod,
} from "../Core/impl"

import {
    CheckResetTokenSendingStatusCoreMaterial,
    CheckResetTokenSendingStatusCoreMaterialPod,
} from "../Core/action"

import { CheckResetTokenSendingStatusLocationDetecter } from "../../method"

export function newCheckSendingStatusMaterial(
    detecter: CheckResetTokenSendingStatusLocationDetecter,
): CheckResetTokenSendingStatusCoreMaterial {
    return initCheckResetTokenSendingStatusCoreMaterial(newCheckSendingStatusInfra(), detecter)
}
export function newCheckSendingStatusMaterialPod(): CheckResetTokenSendingStatusCoreMaterialPod {
    return initCheckResetTokenSendingStatusCoreMaterialPod(newCheckSendingStatusInfra())
}
