import { TicketNonce } from "../credential/data"
import { RenewCredentialEvent } from "./data"

export interface RenewCredentialAction {
    renewCredential(ticketNonce: TicketNonce): Promise<void>
}

export type RenewCredentialEventPubSub = [RenewCredentialEventPublisher, RenewCredentialEventSubscriber]

export interface RenewCredentialEventPublisher {
    publishRenewCredentialEvent(event: RenewCredentialEvent): void
}

export interface RenewCredentialEventSubscriber {
    onRenewCredential(pub: Publisher<RenewCredentialEvent>): void
}

interface Publisher<T> {
    (state: T): void
}
