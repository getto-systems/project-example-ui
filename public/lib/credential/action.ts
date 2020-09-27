import { TicketNonce, RenewEvent, RenewRun } from "./data"

export interface CredentialAction {
    sub: CredentialEventSubscriber

    renew(ticketNonce: TicketNonce): Promise<void>
    setRenewInterval(ticketNonce: TicketNonce, run: RenewRun): Promise<void>
}

export interface CredentialEventPublisher {
    postRenewEvent(event: RenewEvent): void
}

export interface CredentialEventSubscriber {
    onRenew(stateChanged: Post<RenewEvent>): void
}

interface Post<T> {
    (state: T): void
}
