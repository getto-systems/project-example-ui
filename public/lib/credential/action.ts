import { AuthResource, AuthCredential, RenewEvent, StoreEvent, FetchResponse } from "./data"

export interface CredentialAction {
    sub: CredentialEventSubscriber

    fetch(): FetchResponse
    renew(response: FetchResponse): void
    storeCredential(authCredential: AuthCredential): void
    setContinuousRenew(authResource: AuthResource): void
}

export interface CredentialEventPublisher {
    postRenewEvent(event: RenewEvent): void
    postStoreEvent(event: StoreEvent): void
}

export interface CredentialEventSubscriber {
    onRenewEvent(stateChanged: Post<RenewEvent>): void
    onStoreEvent(stateChanged: Post<StoreEvent>): void
}

interface Post<T> {
    (state: T): void
}
