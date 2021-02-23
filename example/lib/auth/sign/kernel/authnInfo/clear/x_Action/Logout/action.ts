import { ApplicationStateAction } from "../../../../../../../z_getto/application/action"

import { ClearAuthnInfoMethod } from "../../method"

import { ClearAuthnInfoEvent } from "../../event"

export type LogoutResource = Readonly<{
    logout: LogoutAction
}>

export interface LogoutAction
    extends ApplicationStateAction<LogoutState> {
    submit(): void
}

export type LogoutMaterial = Readonly<{
    clear: ClearAuthnInfoMethod
}>

export type LogoutState =
    | Readonly<{ type: "initial-logout" }>
    | ClearAuthnInfoEvent

export const initialLogoutState: LogoutState = {
    type: "initial-logout",
}
