import { CredentialAction } from "../../credential/action"

import { FetchError, RenewError, StoreError } from "../../credential/data"

export interface RenewCredentialComponent {
    hook(stateChanged: Post<RenewCredentialState>): void
    onStateChange(stateChanged: Post<RenewCredentialState>): void
    terminate(): void
    renew(): Promise<void>
}

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

export interface RenewCredentialComponentAction {
    credential: CredentialAction
}

interface Post<T> {
    (state: T): void
}
