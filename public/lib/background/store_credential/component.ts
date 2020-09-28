import { AuthCredential, StoreEvent, FetchResponse } from "../../credential/data"

export interface StoreCredentialComponent {
    sub: StoreEventSubscriber
    fetch(): FetchResponse
}

export type StoreCredentialComponentResource = Readonly<{
    component: StoreCredentialComponent
    trigger: Post<StoreCredentialOperation>
}>

export interface StoreEventSubscriber {
    onStoreEvent(post: Post<StoreEvent>): void
}

export type StoreCredentialOperation =
    Readonly<{ type: "store", authCredential: AuthCredential }>

export type StoreCredentialOperationPubSub = Readonly<{
    trigger: Post<StoreCredentialOperation>
    sub: StoreCredentialOperationSubscriber
}>
export interface StoreCredentialOperationSubscriber {
    handleOperation(post: Post<StoreCredentialOperation>): void
}

interface Post<T> {
    (state: T): void
}
