import { AuthCredential, TicketNonce, FetchEvent, RenewEvent, StoreEvent, StoreError } from "./data"

export interface CredentialAction {
    sub: CredentialEventSubscriber
    fetch(): Promise<void>
    renew(ticketNonce: TicketNonce): Promise<void>
    store(authCredential: AuthCredential): Promise<void>

    storeDeprecated(event: StoreEventPublisher, authCredential: AuthCredential): Promise<void>
}

export interface CredentialEventPublisher {
    publishFetchEvent(event: FetchEvent): void
    publishRenewEvent(event: RenewEvent): void
    publishStoreEvent(event: StoreEvent): void
}

export interface CredentialEventSubscriber {
    onFetch(stateChanged: Publisher<FetchEvent>): void
    onRenew(stateChanged: Publisher<RenewEvent>): void
    onStore(stateChanged: Publisher<StoreEvent>): void
}

export interface StoreEventPublisher {
    failedToStore(err: StoreError): void
    succeedToStore(): void
}

interface Publisher<T> {
    (state: T): void
}
