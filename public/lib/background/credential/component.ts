import { AuthCredential, StoreEvent, FetchResponse } from "../../credential/data"

export interface BackgroundCredentialComponent {
    sub: BackgroundCredentialEventSubscriber
    fetch(): FetchResponse
}

export type BackgroundCredentialComponentResource = Readonly<{
    background: BackgroundCredentialComponent
    request: Post<BackgroundCredentialOperation>
}>

export interface BackgroundCredentialEventSubscriber {
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
