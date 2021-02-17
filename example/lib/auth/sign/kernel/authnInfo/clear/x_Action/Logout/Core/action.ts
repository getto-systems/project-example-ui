import { ApplicationAction } from "../../../../../../../../common/vendor/getto-example/Application/action"

import { ClearAuthnInfoMethod } from "../../../method"

import { ClearAuthnInfoEvent } from "../../../event"

export type LogoutResource = Readonly<{
    clear: ClearAuthnInfoAction
}>

export interface ClearAuthnInfoAction
    extends ApplicationAction<ClearAuthnInfoState> {
    submit(): void
}

export type ClearAuthnInfoMaterial = Readonly<{
    clear: ClearAuthnInfoMethod
}>

export type ClearAuthnInfoState =
    | Readonly<{ type: "initial-logout" }>
    | ClearAuthnInfoEvent

export const initialClearAuthnInfoState: ClearAuthnInfoState = {
    type: "initial-logout",
}
