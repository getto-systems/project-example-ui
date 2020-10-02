import { MenuSearch, FetchResponse, StoreEvent } from "../../location/data"

export interface BackgroundLocationComponent {
    sub: BackgroundLocationEventSubscriber
    fetchMenuSearch(): FetchResponse<MenuSearch>
}

export type BackgroundLocationComponentResource = Readonly<{
    background: BackgroundLocationComponent
    request: Post<BackgroundLocationOperation>
}>

export interface BackgroundLocationEventSubscriber {
    onStoreEvent(post: Post<StoreEvent>): void
}

export type BackgroundLocationOperation =
    Readonly<{ type: "store-menu-search", search: MenuSearch }>

export type BackgroundLocationOperationPubSub = Readonly<{
    request: Post<BackgroundLocationOperation>
    sub: BackgroundLocationOperationSubscriber
}>
export interface BackgroundLocationOperationSubscriber {
    handleOperation(post: Post<BackgroundLocationOperation>): void
}

interface Post<T> {
    (state: T): void
}
