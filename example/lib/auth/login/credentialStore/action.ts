import { ForceRenewEvent, RenewEvent } from "./event"

import { SetContinuousRenewEvent, StoreAuthCredential } from "./data"

export type RenewAction = Readonly<{
    renew: RenewPod
    forceRenew: ForceRenewPod
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

export interface ForceRenewPod {
    (): ForceRenew
}
export interface ForceRenew {
    (post: Post<ForceRenewEvent>): void
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
