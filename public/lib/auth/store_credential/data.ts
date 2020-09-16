import { CredentialEventHandler } from "../../credential/action"

import { AuthCredential, StoreError } from "../../credential/data"

export interface StoreCredentialComponent {
    init(stateChanged: Publisher<StoreCredentialComponentState>): void
    terminate(): void
    store(authCredential: AuthCredential): Promise<void>
}

export type StoreCredentialComponentState =
    Readonly<{ type: "initial-store" }> |
    Readonly<{ type: "failed-to-store", err: StoreError }> |
    Readonly<{ type: "succeed-to-store" }>

export const initialStoreCredentialComponentState: StoreCredentialComponentState = { type: "initial-store" }

export interface StoreCredentialComponentEventHandler extends CredentialEventHandler {
    onStateChange(stateChanged: Publisher<StoreCredentialComponentState>): void
}

interface Publisher<T> {
    (state: T): void
}
