import { RenewCredentialState } from "./data"

import { CredentialAction } from "../../credential/action"

export interface RenewCredentialComponent {
    hook(stateChanged: Dispatcher<RenewCredentialState>): void
    onStateChange(stateChanged: Dispatcher<RenewCredentialState>): void
    terminate(): void
    renew(): Promise<void>
}

export interface RenewCredentialComponentAction {
    credential: CredentialAction
}

interface Dispatcher<T> {
    (state: T): void
}
