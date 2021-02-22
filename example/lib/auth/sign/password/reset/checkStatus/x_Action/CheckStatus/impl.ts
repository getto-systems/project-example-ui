import { ApplicationAbstractAction } from "../../../../../../../z_getto/application/impl"

import { newAuthSignLinkResource } from "../../../../../common/searchParams/x_Action/Link/impl"

import { checkPasswordResetSendingStatus } from "../../impl"

import { CheckPasswordResetSendingStatusInfra } from "../../infra"

import {
    CheckPasswordResetSendingStatusAction,
    CheckPasswordResetSendingStatusEntryPoint,
    CheckPasswordResetSendingStatusMaterial,
    CheckPasswordResetSendingStatusMaterialPod,
    CheckPasswordResetSendingStatusState,
} from "./action"

import { CheckPasswordResetSendingStatusLocationInfo } from "../../method"

export function toCheckPasswordResetSendingStatusEntryPoint(
    action: CheckPasswordResetSendingStatusAction,
): CheckPasswordResetSendingStatusEntryPoint {
    return {
        resource: { checkStatus: action, ...newAuthSignLinkResource() },
        terminate: () => {
            action.terminate()
        },
    }
}

export type CheckPasswordResetSendingStatusBase = Readonly<{
    checkStatus: CheckPasswordResetSendingStatusInfra
}>

export function initCheckPasswordResetSendingStatusAction(
    base: CheckPasswordResetSendingStatusBase,
    locationInfo: CheckPasswordResetSendingStatusLocationInfo,
): CheckPasswordResetSendingStatusAction {
    return initCheckPasswordResetSendingStatusAction_merge(
        initCheckPasswordResetSendingStatusMaterialPod(base),
        locationInfo,
    )
}
export function initCheckPasswordResetSendingStatusAction_merge(
    pod: CheckPasswordResetSendingStatusMaterialPod,
    locationInfo: CheckPasswordResetSendingStatusLocationInfo,
): CheckPasswordResetSendingStatusAction {
    return new Action({
        checkStatus: pod.initCheckStatus(locationInfo),
    })
}
export function initCheckPasswordResetSendingStatusMaterialPod(
    base: CheckPasswordResetSendingStatusBase,
): CheckPasswordResetSendingStatusMaterialPod {
    return {
        initCheckStatus: checkPasswordResetSendingStatus(base.checkStatus),
    }
}

class Action
    extends ApplicationAbstractAction<CheckPasswordResetSendingStatusState>
    implements CheckPasswordResetSendingStatusAction {
    material: CheckPasswordResetSendingStatusMaterial

    constructor(material: CheckPasswordResetSendingStatusMaterial) {
        super()
        this.material = material

        this.igniteHook(() => {
            this.material.checkStatus(this.post)
        })
    }
}
