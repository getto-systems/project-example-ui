import { CredentialAction } from "../../../credential/action"

import { FetchError, RenewError, StoreError } from "../../../credential/data"

export interface RenewCredentialComponent {
    onStateChange(stateChanged: Post<RenewCredentialState>): void
    init(): void
    terminate(): void
    trigger(operation: RenewCredentialOperation): Promise<void>
}

export type RenewCredentialParam = { never: RenewCredentialParam }

export type RenewCredentialState =
    Readonly<{ type: "initial-renew" }> |
    Readonly<{ type: "required-to-login" }> |
    Readonly<{ type: "failed-to-fetch", err: FetchError }> |
    Readonly<{ type: "try-to-renew" }> |
    Readonly<{ type: "delayed-to-renew" }> |
    Readonly<{ type: "failed-to-renew", err: RenewError }> |
    Readonly<{ type: "failed-to-store", err: StoreError }> |
    Readonly<{ type: "succeed-to-store" }>

export const initialRenewCredentialState: RenewCredentialState = { type: "initial-renew" }

export type RenewCredentialOperation =
    Readonly<{ type: "renew", param: RenewCredentialParam }>

export interface RenewCredentialComponentAction {
    credential: CredentialAction
}

interface Post<T> {
    (state: T): void
}
