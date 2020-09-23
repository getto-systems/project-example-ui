import { RenewCredentialState } from "./data"

import { CredentialAction } from "../../credential/action"

export interface RenewCredentialComponent {
    hook(stateChanged: Publisher<RenewCredentialState>): void
    onStateChange(stateChanged: Publisher<RenewCredentialState>): void
    terminate(): void
    renew(): Promise<void>
}

export interface RenewCredentialComponentAction {
    credential: CredentialAction
}

interface Publisher<T> {
    (state: T): void
}
