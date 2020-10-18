import { AuthCredential, RenewEvent, SetContinuousRenewEvent, StoreEvent } from "./data"

export interface RenewAction {
    (post: Post<RenewEvent>): void
}

export interface SetContinuousRenewAction {
    (post: Post<SetContinuousRenewEvent>): void
}

export interface StoreAction {
    (authCredential: AuthCredential, post: Post<StoreEvent>): void
}

interface Post<T> {
    (state: T): void
}
