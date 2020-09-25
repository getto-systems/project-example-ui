import { CredentialAction } from "../../../credential/action"

import { AuthCredential, TicketNonce, RenewError } from "../../../credential/data"

export interface RenewCredentialComponent {
    onStateChange(stateChanged: Post<RenewCredentialState>): void
    init(): void
    terminate(): void
    trigger(operation: RenewCredentialOperation): Promise<void>
}

export type RenewCredentialParam = { never: RenewCredentialParam }

export type RenewCredentialState =
    Readonly<{ type: "initial-renew" }> |
    Readonly<{ type: "required-to-login" }> |
    Readonly<{ type: "try-to-renew" }> |
    Readonly<{ type: "delayed-to-renew" }> |
    Readonly<{ type: "failed-to-renew", err: RenewError }> |
    Readonly<{ type: "succeed-to-renew", authCredential: AuthCredential }> |
    Readonly<{ type: "succeed-to-renew-interval", authCredential: AuthCredential }>

export const initialRenewCredentialState: RenewCredentialState = { type: "initial-renew" }

export type RenewCredentialOperation =
    Readonly<{ type: "renew", param: RenewCredentialParam }> |
    Readonly<{ type: "set-renew-interval", ticketNonce: TicketNonce }>

export interface RenewCredentialComponentAction {
    credential: CredentialAction
}

interface Post<T> {
    (state: T): void
}
