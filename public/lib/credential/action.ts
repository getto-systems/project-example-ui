import { LastAuth, AuthCredential, RenewEvent, StoreEvent, FetchResponse } from "./data"

export interface CredentialAction {
    sub: CredentialEventSubscriber

    fetch(): FetchResponse
    renew(lastAuth: LastAuth): void
    storeCredential(authCredential: AuthCredential): void
    removeCredential(): void
    setContinuousRenew(lastAuth: LastAuth): void
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
