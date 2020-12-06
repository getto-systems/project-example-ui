import { LastLogin } from "../../common/credential/data"
import { RenewEvent, SetContinuousRenewEvent } from "./data"

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

interface Post<T> {
    (state: T): void
}
