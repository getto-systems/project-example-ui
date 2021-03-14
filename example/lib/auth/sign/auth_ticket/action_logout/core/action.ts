import { ApplicationStateAction } from "../../../../../z_vendor/getto-application/action/action"

import { ClearAuthTicketMethod } from "../../clear/method"

import { ClearAuthTicketEvent } from "../../clear/event"

export interface LogoutCoreAction extends ApplicationStateAction<LogoutCoreState> {
    submit(): void
}

export type LogoutCoreMaterial = Readonly<{
    clear: ClearAuthTicketMethod
}>

export type LogoutCoreState = Readonly<{ type: "initial-logout" }> | ClearAuthTicketEvent

export const initialLogoutCoreState: LogoutCoreState = { type: "initial-logout" }
