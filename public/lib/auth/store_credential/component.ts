import { StoreCredentialState } from "./data"

import { CredentialAction } from "../../credential/action"

import { AuthCredential } from "../../credential/data"

export interface StoreCredentialComponent {
    hook(stateChanged: Publisher<StoreCredentialState>): void
    onStateChange(stateChanged: Publisher<StoreCredentialState>): void
    terminate(): void
    store(authCredential: AuthCredential): Promise<void>
}

export interface StoreCredentialComponentAction {
    credential: CredentialAction
}

interface Publisher<T> {
    (state: T): void
}
