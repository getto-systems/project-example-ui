import { ForceRenewEvent, LogoutEvent, RenewEvent, SetContinuousRenewEvent } from "./event"

import {  StoreAuthCredential } from "./data"

export type RenewAction = Readonly<{
    renew: RenewPod
    forceRenew: ForceRenewPod
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

export type SetContinuousRenewAction = Readonly<{
    setContinuousRenew: SetContinuousRenewPod
}>

export interface SetContinuousRenewPod {
    (): SetContinuousRenew
}
export interface SetContinuousRenew {
    (authCredential: StoreAuthCredential, post: Post<SetContinuousRenewEvent>): void
}

export type LogoutAction = Readonly<{
    logout: LogoutPod
}>

export interface LogoutPod {
    (): Logout
}
export interface Logout {
    (post: Post<LogoutEvent>): void
}

interface Post<T> {
    (state: T): void
}
