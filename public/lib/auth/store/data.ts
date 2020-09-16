import { CredentialEventHandler } from "../../credential/action"

import { AuthCredential, StoreError } from "../../credential/data"

export interface StoreComponent {
    init(stateChanged: Publisher<StoreComponentState>): void
    terminate(): void
    store(authCredential: AuthCredential): Promise<void>
}

export type StoreComponentState =
    Readonly<{ type: "initial-store" }> |
    Readonly<{ type: "failed-to-store", err: StoreError }> |
    Readonly<{ type: "succeed-to-store" }>

export const initialStoreComponentState: StoreComponentState = { type: "initial-store" }

export interface StoreComponentEventHandler extends CredentialEventHandler {
    onStateChange(stateChanged: Publisher<StoreComponentState>): void
}

interface Publisher<T> {
    (state: T): void
}
