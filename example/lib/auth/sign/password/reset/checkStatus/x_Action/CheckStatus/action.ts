import { ApplicationStateAction } from "../../../../../../../z_getto/action/action"

import { AuthSignLinkResource } from "../../../../../common/searchParams/x_Action/Link/action"

import { CheckSendingStatusMethod, CheckSendingStatusMethodPod } from "../../method"

import { CheckSendingStatusEvent } from "../../event"

export type CheckPasswordResetSendingStatusEntryPoint = Readonly<{
    resource: CheckPasswordResetSendingStatusResource
    terminate: { (): void }
}>

export type CheckPasswordResetSendingStatusResource = AuthSignLinkResource &
    Readonly<{ checkStatus: CheckPasswordResetSendingStatusAction }>

export type CheckPasswordResetSendingStatusAction = ApplicationStateAction<CheckSendingStatusState>

export type CheckSendingStatusMaterial = Readonly<{
    checkStatus: CheckSendingStatusMethod
}>
export type CheckSendingStatusMaterialPod = Readonly<{
    initCheckStatus: CheckSendingStatusMethodPod
}>

export type CheckSendingStatusState =
    | Readonly<{ type: "initial-check-status" }>
    | CheckSendingStatusEvent

export const initialCheckSendingStatusState: CheckSendingStatusState = {
    type: "initial-check-status",
}
