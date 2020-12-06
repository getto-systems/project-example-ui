import { AuthCredential, LastLogin } from "../../common/credential/data"
import { FindEvent, RemoveEvent, RenewEvent, SetContinuousRenewEvent, StoreEvent } from "./data"

export interface Renew {
    (): RenewAction
}
export interface RenewAction {
    (lastLogin: LastLogin, post: Post<RenewEvent>): void
}

export interface SetContinuousRenew {
    (): SetContinuousRenewAction
}
export interface SetContinuousRenewAction {
    (lastLogin: LastLogin, post: Post<SetContinuousRenewEvent>): void
}

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
