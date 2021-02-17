import { ApplicationAction } from "../../../../../common/vendor/getto-example/Application/action"

import { ClearAuthnInfoMethod } from "../../../authnInfo/clear/method"

import { ClearAuthnInfoEvent } from "../../../authnInfo/clear/event"

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
