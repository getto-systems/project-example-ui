import { SignLinkResource } from "../../../../common/link/Action/resource"
import {
    CheckResetTokenSendingStatusCoreAction,
    CheckResetTokenSendingStatusCoreState,
} from "./Core/action"

export type CheckResetTokenSendingStatusEntryPoint = Readonly<{
    resource: CheckResetTokenSendingStatusResource
    terminate: { (): void }
}>

export type CheckResetTokenSendingStatusResource = SignLinkResource &
    Readonly<{ checkStatus: CheckResetTokenSendingStatusCoreAction }>

export type CheckResetTokenSendingStatusResourceState = Readonly<{
    state: CheckResetTokenSendingStatusCoreState
}>
