import { ApplicationEntryPoint } from "../../../../z_vendor/getto-application/action/action"

import { CheckAuthTicketCoreAction, CheckAuthTicketCoreState } from "./core/action"

export type CheckAuthTicketEntryPoint = ApplicationEntryPoint<CheckAuthTicketResource>

export type CheckAuthTicketResource = Readonly<{
    core: CheckAuthTicketCoreAction
}>
export type CheckAuthTicketResourceState = Readonly<{
    state: CheckAuthTicketCoreState
}>
