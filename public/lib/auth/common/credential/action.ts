import { AuthCredential } from "../../common/credential/data"
import { FindEvent, RemoveEvent, StoreEvent } from "./data"

export interface Find {
    (): FindAction
}
export interface FindAction {
    (post: Post<FindEvent>): void
}

export interface Store {
    (): StoreAction
}
export interface StoreAction {
    (authCredential: AuthCredential, post: Post<StoreEvent>): void
}

export interface Remove {
    (): RemoveAction
}
export interface RemoveAction {
    (post: Post<RemoveEvent>): void
}

interface Post<T> {
    (state: T): void
}
