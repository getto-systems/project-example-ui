import { StoreCredentialState } from "./data"

import { CredentialAction } from "../../credential/action"

import { AuthCredential } from "../../credential/data"

export interface StoreCredentialComponent {
    hook(stateChanged: Dispatcher<StoreCredentialState>): void
    onStateChange(stateChanged: Dispatcher<StoreCredentialState>): void
    terminate(): void
    store(authCredential: AuthCredential): Promise<void>
}

export interface StoreCredentialComponentAction {
    credential: CredentialAction
}

interface Dispatcher<T> {
    (state: T): void
}
