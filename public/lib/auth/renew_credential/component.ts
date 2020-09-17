import { CredentialAction } from "../../credential/action"

import { RenewCredentialComponentState } from "./data"

import { TicketNonce } from "../../credential/data"

export interface RenewCredentialComponent {
    hook(stateChanged: Publisher<RenewCredentialComponentState>): void
    init(stateChanged: Publisher<RenewCredentialComponentState>): void
    terminate(): void
    renew(ticketNonce: TicketNonce): Promise<void>
}

export interface RenewCredentialComponentAction {
    credential: CredentialAction
}

interface Publisher<T> {
    (state: T): void
}
