import { Clock } from "../../../z_infra/clock/infra"
import { Delayed } from "../../../z_infra/delayed/infra"
import { RemoteAccess, RemoteAccessResult } from "../../../z_infra/remote/infra"
import { RemoteAccessSimulator } from "../../../z_infra/remote/simulate"
import { DelayTime, ExpireTime, IntervalTime } from "../../../z_infra/time/infra"

import { AuthCredential, LastLogin, StorageError, TicketNonce } from "../../common/credential/data"
import { RenewRemoteError } from "./data"

export type RenewActionConfig = Readonly<{
    renew: RenewConfig
}>
export type SetContinuousRenewActionConfig = Readonly<{
    setContinuousRenew: SetContinuousRenewConfig
}>

export type RenewInfra = Readonly<{
    authCredentials: AuthCredentialRepository
    config: RenewConfig
    renew: RenewRemoteAccess
    clock: Clock
    delayed: Delayed
}>
export type SetContinuousRenewInfra = Readonly<{
    authCredentials: AuthCredentialRepository
    config: SetContinuousRenewConfig
    renew: RenewRemoteAccess
    clock: Clock
}>
export type LogoutInfra = Readonly<{
    authCredentials: AuthCredentialRepository
}>

export type RenewConfig = Readonly<{
    instantLoadExpire: ExpireTime
    delay: DelayTime
}>
export type SetContinuousRenewConfig = Readonly<{
    interval: IntervalTime
    delay: DelayTime
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

export type RenewRemoteAccess = RemoteAccess<TicketNonce, AuthCredential, RenewRemoteError>
export type RenewRemoteAccessResult = RemoteAccessResult<AuthCredential, RenewRemoteError>
export type RenewSimulator = RemoteAccessSimulator<TicketNonce, AuthCredential, RenewRemoteError>
