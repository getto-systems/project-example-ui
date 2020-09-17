import { CredentialAction } from "../../credential/action"

import { StoreCredentialComponentState } from "./data"

import { AuthCredential } from "../../credential/data"

export interface StoreCredentialComponent {
    hook(stateChanged: Publisher<StoreCredentialComponentState>): void
    init(stateChanged: Publisher<StoreCredentialComponentState>): void
    terminate(): void
    store(authCredential: AuthCredential): Promise<void>
}

export interface StoreCredentialComponentAction {
    credential: CredentialAction
}

interface Publisher<T> {
    (state: T): void
}
