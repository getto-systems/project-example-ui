import { ApplicationAction } from "../../../../../common/vendor/getto-example/Application/action"

import { ClearAuthCredentialMethod } from "../../../authCredential/clear/method"

import { ClearAuthCredentialEvent } from "../../../authCredential/clear/event"

export interface ClearAuthCredentialAction
    extends ApplicationAction<ClearAuthCredentialActionState> {
    submit(): void
}

export type ClearAuthCredentialMaterial = Readonly<{
    clear: ClearAuthCredentialMethod
}>

export type ClearAuthCredentialActionState =
    | Readonly<{ type: "initial-logout" }>
    | ClearAuthCredentialEvent

export const initialClearAuthCredentialActionState: ClearAuthCredentialActionState = {
    type: "initial-logout",
}
