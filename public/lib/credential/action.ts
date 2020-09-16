import { AuthCredential, FetchEvent, StoreEvent, StoreError } from "./data"

export interface CredentialAction {
    sub: CredentialEventSubscriber
    fetch(): Promise<void>
    store(authCredential: AuthCredential): Promise<void>

    storeDeprecated(event: StoreEventPublisher, authCredential: AuthCredential): Promise<void>
}

export interface CredentialEventPublisher {
    publishFetchEvent(event: FetchEvent): void
    publishStoreEvent(event: StoreEvent): void
}

export interface CredentialEventSubscriber {
    onFetch(stateChanged: Publisher<FetchEvent>): void
    onStore(stateChanged: Publisher<StoreEvent>): void
}

export interface StoreEventPublisher {
    failedToStore(err: StoreError): void
    succeedToStore(): void
}

interface Publisher<T> {
    (state: T): void
}
