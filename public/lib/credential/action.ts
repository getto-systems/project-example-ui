import { AuthCredential, RenewEvent, StoreEvent } from "./data"

export interface RenewAction {
    renew(): void
    setContinuousRenew(): void
}

export interface RenewFactory {
    (): RenewResource
}
export type RenewResource = Readonly<{
    action: RenewAction
    subscriber: RenewSubscriber
}>

export interface RenewSubscriber {
    onRenewEvent(post: Post<RenewEvent>): void
}

export interface StoreAction {
    (authCredential: AuthCredential): void
}

export interface StoreFactory {
    (): StoreResource
}
export type StoreResource = Readonly<{
    action: StoreAction
    subscriber: StoreSubscriber
}>

export interface StoreSubscriber {
    onStoreEvent(stateChanged: Post<StoreEvent>): void
}

interface Post<T> {
    (state: T): void
}
