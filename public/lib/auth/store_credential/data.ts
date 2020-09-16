import { AuthCredential, StoreEvent, StoreError } from "../../credential/data"

export interface StoreCredentialComponent {
    hook(stateChanged: Publisher<StoreEvent>): void
    init(stateChanged: Publisher<StoreCredentialComponentState>): void
    terminate(): void
    store(authCredential: AuthCredential): Promise<void>
}

export type StoreCredentialComponentState =
    Readonly<{ type: "initial-store" }> |
    Readonly<{ type: "failed-to-store", err: StoreError }> |
    Readonly<{ type: "succeed-to-store" }>

export const initialStoreCredentialComponentState: StoreCredentialComponentState = { type: "initial-store" }

interface Publisher<T> {
    (state: T): void
}
