import { newCheckSendingStatusInfra } from "../../../init"

import { initMaterial, initMaterialPod } from "../impl"

import { CheckSendingStatusMaterial, CheckSendingStatusMaterialPod } from "../action"

import { CheckSendingStatusLocationInfo } from "../../../method"

export function newCheckSendingStatusMaterial(
    locationInfo: CheckSendingStatusLocationInfo,
): CheckSendingStatusMaterial {
    return initMaterial(newCheckSendingStatusInfra(), locationInfo)
}
export function newCheckSendingStatusMaterialPod(): CheckSendingStatusMaterialPod {
    return initMaterialPod(newCheckSendingStatusInfra())
}
