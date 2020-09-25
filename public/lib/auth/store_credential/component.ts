import { StoreCredentialState } from "./data"

import { CredentialAction } from "../../credential/action"

import { AuthCredential } from "../../credential/data"

export interface StoreCredentialComponent {
    hook(stateChanged: Post<StoreCredentialState>): void
    onStateChange(stateChanged: Post<StoreCredentialState>): void
    terminate(): void
    store(authCredential: AuthCredential): Promise<void>
}

export interface StoreCredentialComponentAction {
    credential: CredentialAction
}

interface Post<T> {
    (state: T): void
}
