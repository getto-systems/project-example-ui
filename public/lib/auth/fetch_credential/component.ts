import { FetchCredentialComponentState } from "./data"

import { CredentialAction } from "../../credential/action"

export interface FetchCredentialComponent {
    hook(stateChanged: Publisher<FetchCredentialComponentState>): void
    init(stateChanged: Publisher<FetchCredentialComponentState>): void
    terminate(): void
    fetch(): Promise<void>
}

export interface FetchCredentialComponentAction {
    credential: CredentialAction
}

interface Publisher<T> {
    (state: T): void
}
