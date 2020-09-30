import { AuthCredential, TicketNonce, AuthAt, FetchError, StoreError, RenewError } from "./data"

export type Infra = Readonly<{
    timeConfig: TimeConfig

    authCredentials: AuthCredentialRepository
    expires: AuthExpires
    runner: RenewRunner

    renewClient: RenewClient
    delayed: Delayed
}>

export type TimeConfig = Readonly<{
    instantLoadExpireTime: ExpireTime
    renewRunDelayTime: DelayTime

    renewDelayTime: DelayTime,
    renewIntervalTime: IntervalTime,
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

export type ExpireTime = Readonly<{ expire_milli_second: number }>
export type DelayTime = Readonly<{ delay_milli_second: number }>
export type IntervalTime = Readonly<{ interval_milli_second: number }>

export type StorageKey = Readonly<{
    ticketNonce: string
    apiCredential: string
    lastAuthAt: string
}>

export type FindResponse<T> =
    Readonly<{ success: false, err: FetchError }> |
    Readonly<{ success: true, found: false }> |
    Readonly<{ success: true, found: true, content: T }>

export type StoreResponse =
    Readonly<{ success: true }> |
    Readonly<{ success: false, err: StoreError }>

export type RenewResponse =
    Readonly<{ success: false, err: RenewError }> |
    Readonly<{ success: true, hasCredential: false }> |
    Readonly<{ success: true, hasCredential: true, authCredential: AuthCredential }>

interface DelayedHandler {
    (): void
}
