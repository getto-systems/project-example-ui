import { ApiCredentialRepository } from "../../../../common/auth/apiCredential/infra"
import { Clock } from "../../../../z_infra/clock/infra"
import { Delayed } from "../../../../z_infra/delayed/infra"
import {
    RemoteAccess,
    RemoteAccessResult,
    RemoteAccessSimulator,
} from "../../../../z_infra/remote/infra"
import { DelayTime, ExpireTime, IntervalTime } from "../../../../z_infra/time/infra"

import { AuthCredential, LastLogin, RenewRemoteError, StorageError, TicketNonce } from "./data"

export type RenewInfra = Readonly<{
    apiCredentials: ApiCredentialRepository
    authCredentials: AuthCredentialRepository
    config: RenewConfig
    renew: RenewRemoteAccess
    clock: Clock
    delayed: Delayed
}>
export type RenewConfig = Readonly<{
    instantLoadExpire: ExpireTime
    delay: DelayTime
}>

export type SetContinuousRenewInfra = Readonly<{
    apiCredentials: ApiCredentialRepository
    authCredentials: AuthCredentialRepository
    config: SetContinuousRenewConfig
    renew: RenewRemoteAccess
    clock: Clock
}>
export type SetContinuousRenewConfig = Readonly<{
    interval: IntervalTime
    delay: DelayTime
}>

export type LogoutInfra = Readonly<{
    apiCredentials: ApiCredentialRepository
    authCredentials: AuthCredentialRepository
}>

export interface AuthCredentialRepository {
    load(): LoadLastLoginResult
    store(authCredential: AuthCredential): StoreResult
    remove(): StoreResult
}

export type LoadLastLoginResult =
    | Readonly<{ success: true; found: true; lastLogin: LastLogin }>
    | Readonly<{ success: true; found: false }>
    | Readonly<{ success: false; err: StorageError }>

export type StoreResult = Readonly<{ success: true }> | Readonly<{ success: false; err: StorageError }>

export type RenewRemoteAccess = RemoteAccess<TicketNonce, AuthCredential, RenewRemoteError>
export type RenewRemoteAccessResult = RemoteAccessResult<AuthCredential, RenewRemoteError>
export type RenewSimulator = RemoteAccessSimulator<TicketNonce, AuthCredential, RenewRemoteError>
