import { RenewCredentialAction } from "../../renew_credential/action"

import { AuthCredential, TicketNonce, RenewError } from "../../credential/data"

export interface RenewCredentialComponentAction {
    renewCredential: RenewCredentialAction,
}

export interface RenewCredentialComponent {
    init(stateChanged: Publisher<RenewCredentialComponentState>): void
    terminate(): void
    trigger(operation: RenewCredentialComponentOperation): Promise<void>
}

export type RenewCredentialComponentState =
    Readonly<{ type: "initial-renew" }> |
    Readonly<{ type: "try-to-renew" }> |
    Readonly<{ type: "delayed-to-renew" }> |
    Readonly<{ type: "unauthorized" }> |
    Readonly<{ type: "failed-to-renew", err: RenewError }> |
    Readonly<{ type: "succeed-to-renew", authCredential: AuthCredential }>

export const initialRenewCredentialComponentState: RenewCredentialComponentState = { type: "initial-renew" }

export type RenewCredentialComponentOperation =
    Readonly<{ type: "renew", ticketNonce: TicketNonce }>

interface Publisher<T> {
    (state: T): void
}
