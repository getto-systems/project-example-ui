import {
    RemoteAccess,
    RemoteAccessResult,
    RemoteAccessSimulator,
} from "../../../../z_infra/remote/infra"
import { StoreResult } from "../../../../common/storage/infra"

import { StorageError } from "../../../../common/storage/data"
import { AuthCredential, LastAuth, RenewAuthCredentialRemoteError, TicketNonce } from "./data"
import { ApiCredential } from "../../../../common/apiCredential/data"

export interface AuthCredentialRepository {
    load(): LoadLastAuthResult
    store(authCredential: AuthCredential): StoreResult
    remove(): StoreResult
}

export type LoadLastAuthResult =
    | Readonly<{ success: true; found: true; lastLogin: LastAuth }>
    | Readonly<{ success: true; found: false }>
    | Readonly<{ success: false; err: StorageError }>

export type RenewAuthCredentialRemoteAccess = RemoteAccess<
    TicketNonce,
    RenewAuthCredentialRemoteResponse,
    RenewAuthCredentialRemoteError
>
export type RenewAuthCredentialRemoteAccessResult = RemoteAccessResult<
    RenewAuthCredentialRemoteResponse,
    RenewAuthCredentialRemoteError
>
export type RenewAuthCredentialSimulator = RemoteAccessSimulator<
    TicketNonce,
    RenewAuthCredentialRemoteResponse,
    RenewAuthCredentialRemoteError
>
export type RenewAuthCredentialRemoteResponse = Readonly<{
    auth: AuthCredential
    api: ApiCredential
}>
