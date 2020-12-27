import { Clock } from "../../../z_infra/clock/infra"

import {
    AuthCredential,
    LastLogin,
    StorageError,
    TicketNonce,
} from "../../common/credential/data"
import { RenewError } from "./data"

export type RenewActionConfig = Readonly<{
    renew: RenewConfig
}>
export type SetContinuousRenewActionConfig = Readonly<{
    setContinuousRenew: SetContinuousRenewConfig
}>

export type RenewInfra = Readonly<{
    authCredentials: AuthCredentialRepository
    config: RenewConfig
    renew: RenewClient
    clock: Clock
    delayed: Delayed
}>
export type SetContinuousRenewInfra = Readonly<{
    authCredentials: AuthCredentialRepository
    config: SetContinuousRenewConfig
    renew: RenewClient
    clock: Clock
}>

export type RenewConfig = Readonly<{
    instantLoadExpire: ExpireTime
    delay: DelayTime
}>
export type SetContinuousRenewConfig = Readonly<{
    interval: IntervalTime
    delay: DelayTime
}>

export type StoreInfra = Readonly<{
    authCredentials: AuthCredentialRepository
}>

export interface AuthCredentialRepository {
    findLastLogin(): LoadLastLoginResult
    storeAuthCredential(authCredential: AuthCredential): StoreResult
    removeAuthCredential(): StoreResult
}

export type LoadLastLoginResult =
    | Readonly<{ success: false; err: StorageError }>
    | Readonly<{ success: true; found: false }>
    | Readonly<{ success: true; found: true; lastLogin: LastLogin }>

export type StoreResult = Readonly<{ success: true }> | Readonly<{ success: false; err: StorageError }>

export type StorageKey = Readonly<{
    ticketNonce: string
    apiCredential: string
    lastAuthAt: string
}>

export interface RenewClient {
    renew(ticketNonce: TicketNonce): Promise<RenewResponse>
}

export interface Delayed {
    <T>(promise: Promise<T>, time: DelayTime, handler: DelayedHandler): Promise<T>
}

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
