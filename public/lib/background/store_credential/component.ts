import { AuthCredential, StoreEvent, FetchResponse } from "../../credential/data"

export interface StoreCredentialComponent {
    sub: StoreEventSubscriber

    fetch(): FetchResponse
}

export type StoreCredentialResource = Readonly<{
    component: StoreCredentialComponent
    trigger: StoreCredentialTrigger
}>

export interface StoreEventSubscriber {
    onStoreEvent(post: Post<StoreEvent>): void
}

export type StoreCredentialOperation =
    Readonly<{ type: "store", authCredential: AuthCredential }>

export interface StoreCredentialTrigger {
    trigger(operation: StoreCredentialOperation): void
}
export interface StoreCredentialOperator {
    onTrigger(post: Post<StoreCredentialOperation>): void
}

interface Post<T> {
    (state: T): void
}
