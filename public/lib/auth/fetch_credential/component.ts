import { FetchCredentialState } from "./data"

import { CredentialAction } from "../../credential/action"

export interface FetchCredentialComponent {
    hook(stateChanged: Publisher<FetchCredentialState>): void
    init(stateChanged: Publisher<FetchCredentialState>): void
    terminate(): void
    fetch(): Promise<void>
}

export interface FetchCredentialComponentAction {
    credential: CredentialAction
}

interface Publisher<T> {
    (state: T): void
}
