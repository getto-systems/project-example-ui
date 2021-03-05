import { ApplicationStateAction } from "../../../../../../../z_vendor/getto-application/action/action"
import { CheckResetTokenSendingStatusEvent } from "../../event"
import { CheckResetTokenSendingStatusPod, CheckSendingStatusMethod } from "../../method"

export type CheckResetTokenSendingStatusCoreAction = ApplicationStateAction<
    CheckResetTokenSendingStatusCoreState
>

export type CheckResetTokenSendingStatusCoreMaterial = Readonly<{
    checkStatus: CheckSendingStatusMethod
}>
export type CheckResetTokenSendingStatusCoreMaterialPod = Readonly<{
    initCheckStatus: CheckResetTokenSendingStatusPod
}>

export type CheckResetTokenSendingStatusCoreState =
    | Readonly<{ type: "initial-check-status" }>
    | CheckResetTokenSendingStatusEvent

export const initialCheckResetTokenSendingStatusCoreState: CheckResetTokenSendingStatusCoreState = {
    type: "initial-check-status",
}
