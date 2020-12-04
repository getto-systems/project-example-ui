import { AuthCredential } from "../../common/credential/data";
import { RenewEvent, SetContinuousRenewEvent, StoreEvent } from "./data"

export interface Renew {
    (): RenewAction
}
export interface RenewAction {
    (post: Post<RenewEvent>): void
}

export interface SetContinuousRenew {
    (): SetContinuousRenewAction
}
export interface SetContinuousRenewAction {
    (post: Post<SetContinuousRenewEvent>): void
}

export interface Store {
    (): StoreAction
}
export interface StoreAction {
    (authCredential: AuthCredential, post: Post<StoreEvent>): void
}

interface Post<T> {
    (state: T): void
}
