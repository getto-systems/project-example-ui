import { LastLogin } from "../../common/credential/data"
import { RenewEvent, SetContinuousRenewEvent } from "./data"

export type RenewAction = Readonly<{
    renew: RenewPod
}>

export type SetContinuousRenewAction = Readonly<{
    setContinuousRenew: SetContinuousRenewPod
}>

export interface RenewPod {
    (): Renew
}
export interface Renew {
    (lastLogin: LastLogin, post: Post<RenewEvent>): void
}

export interface SetContinuousRenewPod {
    (): SetContinuousRenew
}
export interface SetContinuousRenew {
    (lastLogin: LastLogin, post: Post<SetContinuousRenewEvent>): void
}

interface Post<T> {
    (state: T): void
}
