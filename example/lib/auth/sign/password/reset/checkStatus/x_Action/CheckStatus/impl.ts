import { ApplicationAbstractStateAction } from "../../../../../../../z_vendor/getto-application/action/impl"

import { newAuthSignLinkResource } from "../../../../../common/searchParams/x_Action/Link/impl"

import { checkSendingStatus } from "../../impl"

import { CheckSendingStatusInfra } from "../../infra"

import {
    CheckPasswordResetSendingStatusAction,
    CheckPasswordResetSendingStatusEntryPoint,
    CheckSendingStatusMaterial,
    CheckSendingStatusMaterialPod,
    CheckSendingStatusState,
} from "./action"

import { CheckSendingStatusLocationDetecter } from "../../method"

export function toEntryPoint(
    action: CheckPasswordResetSendingStatusAction,
): CheckPasswordResetSendingStatusEntryPoint {
    return {
        resource: { checkStatus: action, ...newAuthSignLinkResource() },
        terminate: () => action.terminate(),
    }
}

export function initMaterial(
    infra: CheckSendingStatusInfra,
    detecter: CheckSendingStatusLocationDetecter,
): CheckSendingStatusMaterial {
    const pod = initMaterialPod(infra)
    return {
        checkStatus: pod.initCheckStatus(detecter),
    }
}
export function initMaterialPod(infra: CheckSendingStatusInfra): CheckSendingStatusMaterialPod {
    return {
        initCheckStatus: checkSendingStatus(infra),
    }
}

export function initCheckSendingStatusAction(
    material: CheckSendingStatusMaterial,
): CheckPasswordResetSendingStatusAction {
    return new Action(material)
}

class Action
    extends ApplicationAbstractStateAction<CheckSendingStatusState>
    implements CheckPasswordResetSendingStatusAction {
    readonly initialState: CheckSendingStatusState = { type: "initial-check-status" }

    material: CheckSendingStatusMaterial

    constructor(material: CheckSendingStatusMaterial) {
        super()
        this.material = material

        this.igniteHook(() => {
            this.material.checkStatus(this.post)
        })
    }
}
