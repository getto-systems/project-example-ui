import {
    RemoteAccess,
    RemoteAccessResult,
    RemoteAccessSimulator,
} from "../../../../z_infra/remote/infra"
import { StoreResult } from "../../../../common/auth/storage/infra"

import { StorageError } from "../../../../common/auth/storage/data"
import { AuthCredential, LastLogin, RenewRemoteError, TicketNonce } from "./data"
import { ApiCredential } from "../../../../common/auth/apiCredential/data"

export interface AuthCredentialRepository {
    load(): LoadLastLoginResult
    store(authCredential: AuthCredential): StoreResult
    remove(): StoreResult
}

export type LoadLastLoginResult =
    | Readonly<{ success: true; found: true; lastLogin: LastLogin }>
    | Readonly<{ success: true; found: false }>
    | Readonly<{ success: false; err: StorageError }>

export type RenewRemoteAccess = RemoteAccess<TicketNonce, RenewRemoteResponse, RenewRemoteError>
export type RenewRemoteAccessResult = RemoteAccessResult<RenewRemoteResponse, RenewRemoteError>
export type RenewSimulator = RemoteAccessSimulator<TicketNonce, RenewRemoteResponse, RenewRemoteError>
export type RenewRemoteResponse = Readonly<{
    auth: AuthCredential
    api: ApiCredential
}>
