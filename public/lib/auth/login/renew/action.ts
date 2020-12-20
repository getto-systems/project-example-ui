import { RenewEvent, SetContinuousRenewEvent, StoreAuthCredential } from "./data"

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
    (post: Post<RenewEvent>): void
}

export interface SetContinuousRenewPod {
    (): SetContinuousRenew
}
export interface SetContinuousRenew {
    (authCredential: StoreAuthCredential, post: Post<SetContinuousRenewEvent>): void
}

interface Post<T> {
    (state: T): void
}
