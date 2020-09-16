import { TicketNonce } from "../credential/data"
import { RenewCredentialEvent } from "./data"

export interface RenewCredentialAction {
    sub: RenewCredentialEventSubscriber
    renewCredential(ticketNonce: TicketNonce): Promise<void>
}

export interface RenewCredentialEventPublisher {
    publishRenewCredentialEvent(event: RenewCredentialEvent): void
}

export interface RenewCredentialEventSubscriber {
    onRenewCredential(pub: Publisher<RenewCredentialEvent>): void
}

interface Publisher<T> {
    (state: T): void
}
