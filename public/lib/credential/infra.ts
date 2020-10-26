import { AuthCredential, TicketNonce, AuthAt, StorageError, RenewError } from "./data"

export type RenewInfra = Readonly<{
    time: RenewTimeConfig

    authCredentials: AuthCredentialRepository
    client: RenewClient
    delayed: Delayed

    expires: AuthExpires
}>
export type SetContinuousRenewInfra = Readonly<{
    time: SetContinuousRenewTimeConfig

    authCredentials: AuthCredentialRepository
    client: RenewClient

    runner: RenewRunner
}>

export type RenewTimeConfig = Readonly<{
    instantLoadExpireTime: ExpireTime
    renewDelayTime: DelayTime
}>
export type SetContinuousRenewTimeConfig = Readonly<{
    renewIntervalTime: IntervalTime
    renewRunDelayTime: DelayTime
}>

export type StoreInfra = Readonly<{
    authCredentials: AuthCredentialRepository
}>

export interface AuthCredentialRepository {
    findTicketNonce(): FindResponse<TicketNonce>
    findLastAuthAt(): FindResponse<AuthAt>
    storeAuthCredential(authCredential: AuthCredential): StoreResponse
    removeAuthCredential(): StoreResponse
}

export interface AuthExpires {
    hasExceeded(lastAuthAt: AuthAt, expire: ExpireTime): boolean
}

export interface RenewRunner {
    nextRun(lastAuthAt: AuthAt, delay: DelayTime): DelayTime
}

export interface RenewClient {
    renew(ticketNonce: TicketNonce): Promise<RenewResponse>
}

export interface Delayed {
    <T>(promise: Promise<T>, time: DelayTime, handler: DelayedHandler): Promise<T>
}

export type ExpireTime = Readonly<{ expire_millisecond: number }>
export type DelayTime = Readonly<{ delay_millisecond: number }>
export type IntervalTime = Readonly<{ interval_millisecond: number }>

export type StorageKey = Readonly<{
    ticketNonce: string
    apiCredential: string
    lastAuthAt: string
}>

export type FindResponse<T> =
    | Readonly<{ success: false; err: StorageError }>
    | Readonly<{ success: true; found: false }>
    | Readonly<{ success: true; found: true; content: T }>

export type StoreResponse = Readonly<{ success: true }> | Readonly<{ success: false; err: StorageError }>

export type RenewResponse =
    | Readonly<{ success: false; err: RenewError }>
    | Readonly<{ success: true; hasCredential: false }>
    | Readonly<{ success: true; hasCredential: true; authCredential: AuthCredential }>

interface DelayedHandler {
    (): void
}
