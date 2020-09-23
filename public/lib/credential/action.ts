import { AuthCredential, RenewEvent, StoreEvent } from "./data"

export interface CredentialAction {
    sub: CredentialEventSubscriber
    renew(): Promise<void>
    store(authCredential: AuthCredential): Promise<void>
}

export interface CredentialEventPublisher {
    dispatchRenewEvent(event: RenewEvent): void
    dispatchStoreEvent(event: StoreEvent): void
}

export interface CredentialEventSubscriber {
    onRenew(stateChanged: Publisher<RenewEvent>): void
    onStore(stateChanged: Publisher<StoreEvent>): void
}

interface Publisher<T> {
    (state: T): void
}
