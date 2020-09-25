import { AuthCredential, TicketNonce, RenewEvent, StoreEvent } from "./data"

export interface CredentialAction {
    sub: CredentialEventSubscriber

    renew(ticketNonce: TicketNonce): Promise<void>
    setRenewInterval(ticketNonce: TicketNonce): Promise<void>

    store(authCredential: AuthCredential): Promise<void>
}

export interface CredentialEventPublisher {
    postRenewEvent(event: RenewEvent): void
    postStoreEvent(event: StoreEvent): void
}

export interface CredentialEventSubscriber {
    onRenew(stateChanged: Post<RenewEvent>): void
    onStore(stateChanged: Post<StoreEvent>): void
}

interface Post<T> {
    (state: T): void
}
