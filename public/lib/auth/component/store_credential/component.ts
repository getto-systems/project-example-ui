import { CredentialAction } from "../../../credential/action"

import { AuthCredential, StoreError } from "../../../credential/data"

export interface StoreCredentialComponent {
    hook(stateChanged: Post<StoreCredentialState>): void
    onStateChange(stateChanged: Post<StoreCredentialState>): void
    terminate(): void
    store(authCredential: AuthCredential): Promise<void>
}

export type StoreCredentialState =
    Readonly<{ type: "initial-store" }> |
    Readonly<{ type: "failed-to-store", err: StoreError }> |
    Readonly<{ type: "succeed-to-store" }>

export const initialStoreCredentialState: StoreCredentialState = { type: "initial-store" }

export interface StoreCredentialComponentAction {
    credential: CredentialAction
}

interface Post<T> {
    (state: T): void
}
