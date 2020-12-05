import { AuthCredential, LoginAt, TicketNonce } from "../../common/credential/data"
import { StorageError, RenewError } from "./data"

export type RenewInfra = Readonly<{
    authCredentials: AuthCredentialRepository
    client: RenewClient
    time: RenewTimeConfig
    delayed: Delayed
    expires: AuthExpires
}>
export type SetContinuousRenewInfra = Readonly<{
    authCredentials: AuthCredentialRepository
    client: RenewClient
    time: SetContinuousRenewTimeConfig
    runner: RenewRunner
}>

export type RenewTimeConfig = Readonly<{
    instantLoadExpire: ExpireTime
    delay: DelayTime
}>
export type SetContinuousRenewTimeConfig = Readonly<{
    interval: IntervalTime
    delay: DelayTime
}>

export type StoreInfra = Readonly<{
    authCredentials: AuthCredentialRepository
}>

export interface AuthCredentialRepository {
    findTicketNonce(): FindResponse<TicketNonce>
    findLastLoginAt(): FindResponse<LoginAt>
    storeAuthCredential(authCredential: AuthCredential): StoreResponse
    removeAuthCredential(): StoreResponse
}

export interface AuthExpires {
    hasExceeded(lastAuthAt: LoginAt, expire: ExpireTime): boolean
}

export interface RenewRunner {
    nextRun(lastAuthAt: LoginAt, delay: DelayTime): DelayTime
}

export interface RenewClient {
    renew(ticketNonce: TicketNonce): Promise<RenewResponse>
}

export interface Delayed {
    <T>(promise: Promise<T>, time: DelayTime, handler: DelayedHandler): Promise<T>
}

export type StorageKey = Readonly<{
    ticketNonce: string
    apiCredential: string
    lastLoginAt: string
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

type ExpireTime = Readonly<{ expire_millisecond: number }>
type DelayTime = Readonly<{ delay_millisecond: number }>
type IntervalTime = Readonly<{ interval_millisecond: number }>

interface DelayedHandler {
    (): void
}
