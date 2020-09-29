import { AuthCredential, StoreEvent, FetchResponse } from "../../credential/data"

export interface BackgroundCredentialComponent {
    sub: BackgroundEventSubscriber
    fetch(): FetchResponse
}

export type BackgroundCredentialComponentResource = Readonly<{
    component: BackgroundCredentialComponent
    request: Post<BackgroundCredentialOperation>
}>

export interface BackgroundEventSubscriber {
    onStoreEvent(post: Post<StoreEvent>): void
}

export type BackgroundCredentialOperation =
    Readonly<{ type: "store", authCredential: AuthCredential }>

export type BackgroundCredentialOperationPubSub = Readonly<{
    request: Post<BackgroundCredentialOperation>
    sub: BackgroundCredentialOperationSubscriber
}>
export interface BackgroundCredentialOperationSubscriber {
    handleOperation(post: Post<BackgroundCredentialOperation>): void
}

interface Post<T> {
    (state: T): void
}
