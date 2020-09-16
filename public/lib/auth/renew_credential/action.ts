import { CredentialAction, CredentialEventHandler } from "../../credential/action"

import { AuthCredential, TicketNonce, RenewError } from "../../credential/data"

export interface RenewCredentialComponentAction {
    credential: CredentialAction,
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
    Readonly<{ type: "require-login" }> |
    Readonly<{ type: "failed-to-renew", err: RenewError }> |
    Readonly<{ type: "succeed-to-renew", authCredential: AuthCredential }>

export const initialRenewCredentialComponentState: RenewCredentialComponentState = { type: "initial-renew" }

export type RenewCredentialComponentOperation =
    Readonly<{ type: "renew", ticketNonce: TicketNonce }>

export interface RenewCredentialComponentEventHandler extends CredentialEventHandler {
    onStateChange(stateChanged: Publisher<RenewCredentialComponentState>): void
}

interface Publisher<T> {
    (state: T): void
}
