import {
    RemoteAccess,
    RemoteAccessResult,
    RemoteAccessSimulator,
} from "../../../../z_infra/remote/infra"

import { StorageError } from "../../../../common/auth/storage/data"
import { AuthCredential, LastLogin, RenewRemoteError, TicketNonce } from "./data"

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
