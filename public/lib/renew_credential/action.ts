import { TicketNonce } from "../credential/data"
import { RenewCredentialEvent } from "./data"

export interface RenewCredentialAction {
    renewCredential(ticketNonce: TicketNonce): Promise<void>
}

export interface RenewCredentialEventPublisher {
    onRenewCredential(pub: Publisher<RenewCredentialEvent>): void

    publishRenewCredentialEvent(event: RenewCredentialEvent): void
}

interface Publisher<T> {
    (state: T): void
}
