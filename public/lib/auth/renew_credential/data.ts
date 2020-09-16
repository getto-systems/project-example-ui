import { RenewCredentialError } from "../../renew_credential/data"
import { AuthCredential, TicketNonce } from "../../credential/data"

export interface RenewCredentialComponent {
    hook(stateChanged: Publisher<RenewCredentialComponentState>): void
    init(stateChanged: Publisher<RenewCredentialComponentState>): void
    terminate(): void
    trigger(operation: RenewCredentialComponentOperation): Promise<void>
}

export type RenewCredentialComponentState =
    Readonly<{ type: "initial-renew" }> |
    Readonly<{ type: "try-to-renew" }> |
    Readonly<{ type: "delayed-to-renew" }> |
    Readonly<{ type: "unauthorized" }> |
    Readonly<{ type: "failed-to-renew", err: RenewCredentialError }> |
    Readonly<{ type: "succeed-to-renew", authCredential: AuthCredential }>

export const initialRenewCredentialComponentState: RenewCredentialComponentState = { type: "initial-renew" }

export type RenewCredentialComponentOperation =
    Readonly<{ type: "renew", ticketNonce: TicketNonce }>

interface Publisher<T> {
    (state: T): void
}
