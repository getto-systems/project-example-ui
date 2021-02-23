import { ApplicationStateAction } from "../../../../../../../z_getto/application/action"

import { ClearMethod } from "../../method"

import { ClearEvent } from "../../event"

export type LogoutResource = Readonly<{
    logout: LogoutAction
}>

export interface LogoutAction extends ApplicationStateAction<LogoutState> {
    submit(): void
}

export type LogoutMaterial = Readonly<{
    clear: ClearMethod
}>

export type LogoutState = Readonly<{ type: "initial-logout" }> | ClearEvent

export const initialLogoutState: LogoutState = {
    type: "initial-logout",
}
