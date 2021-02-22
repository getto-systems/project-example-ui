import { ApplicationAction } from "../../../../../../../z_getto/application/action"

import { AuthSignLinkResource } from "../../../../../common/searchParams/x_Action/Link/action"

import {
    CheckPasswordResetSendingStatusMethod,
    CheckPasswordResetSendingStatusMethodPod,
} from "../../method"

import { CheckPasswordResetSendingStatusEvent } from "../../event"

export type CheckPasswordResetSendingStatusEntryPoint = Readonly<{
    resource: CheckPasswordResetSendingStatusResource
    terminate: { (): void }
}>

export type CheckPasswordResetSendingStatusResource = AuthSignLinkResource &
    Readonly<{
        checkStatus: CheckPasswordResetSendingStatusAction
    }>

export type CheckPasswordResetSendingStatusAction = ApplicationAction<
    CheckPasswordResetSendingStatusState
>

export type CheckPasswordResetSendingStatusMaterial = Readonly<{
    checkStatus: CheckPasswordResetSendingStatusMethod
}>
export type CheckPasswordResetSendingStatusMaterialPod = Readonly<{
    initCheckStatus: CheckPasswordResetSendingStatusMethodPod
}>

export type CheckPasswordResetSendingStatusState =
    | Readonly<{ type: "initial-check-status" }>
    | CheckPasswordResetSendingStatusEvent

export const initialCheckPasswordResetSendingStatusState: CheckPasswordResetSendingStatusState = {
    type: "initial-check-status",
}
