import { newCheckSendingStatusInfra } from "../../../init"

import { initMaterial, initMaterialPod } from "../impl"

import { CheckSendingStatusMaterial, CheckSendingStatusMaterialPod } from "../action"

import { CheckSendingStatusLocationDetecter,  } from "../../../method"

export function newCheckSendingStatusMaterial(
    detecter: CheckSendingStatusLocationDetecter,
): CheckSendingStatusMaterial {
    return initMaterial(newCheckSendingStatusInfra(), detecter)
}
export function newCheckSendingStatusMaterialPod(): CheckSendingStatusMaterialPod {
    return initMaterialPod(newCheckSendingStatusInfra())
}
