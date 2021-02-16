import { ApplicationAction } from "../../../../../common/vendor/getto-example/Application/action"

import { ClearAuthnInfoMethod } from "../../../authnInfo/clear/method"

import { ClearAuthnInfoEvent } from "../../../authnInfo/clear/event"

export interface ClearAuthnInfoAction
    extends ApplicationAction<ClearAuthnInfoActionState> {
    submit(): void
}

export type ClearAuthnInfoMaterial = Readonly<{
    clear: ClearAuthnInfoMethod
}>

export type ClearAuthnInfoActionState =
    | Readonly<{ type: "initial-logout" }>
    | ClearAuthnInfoEvent

export const initialClearAuthnInfoActionState: ClearAuthnInfoActionState = {
    type: "initial-logout",
}
