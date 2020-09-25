import { RenewCredentialState } from "./data"

import { CredentialAction } from "../../credential/action"

export interface RenewCredentialComponent {
    hook(stateChanged: Post<RenewCredentialState>): void
    onStateChange(stateChanged: Post<RenewCredentialState>): void
    terminate(): void
    renew(): Promise<void>
}

export interface RenewCredentialComponentAction {
    credential: CredentialAction
}

interface Post<T> {
    (state: T): void
}
