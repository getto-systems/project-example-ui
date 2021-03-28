import { ApplicationView } from "../../../../z_vendor/getto-application/action/action"

import { SignLinkResource } from "../../../common/nav/action_nav/resource"
import {
    CheckResetTokenSendingStatusCoreAction,
    CheckResetTokenSendingStatusCoreState,
} from "./core/action"

export type CheckResetTokenSendingStatusView = ApplicationView<CheckResetTokenSendingStatusResource>

export type CheckResetTokenSendingStatusResource = SignLinkResource &
    Readonly<{ checkStatus: CheckResetTokenSendingStatusCoreAction }>

export type CheckResetTokenSendingStatusResourceState = Readonly<{
    state: CheckResetTokenSendingStatusCoreState
}>
