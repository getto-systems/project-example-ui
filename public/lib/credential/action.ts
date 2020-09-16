import { AuthCredential, FetchEvent, StoreEvent, StoreError } from "./data"

export interface CredentialAction {
    fetch(): Promise<void>
    store(authCredential: AuthCredential): Promise<void>

    storeDeprecated(event: StoreEventPublisher, authCredential: AuthCredential): Promise<void>
}

export interface CredentialEventHandler {
    handleFetchEvent(event: FetchEvent): void
    handleStoreEvent(event: StoreEvent): void
}

export interface StoreEventPublisher {
    failedToStore(err: StoreError): void
    succeedToStore(): void
}
