import {
    Remote,
    RemoteResult,
    RemoteSimulator,
} from "../../../../../z_vendor/getto-application/infra/remote/infra"

import {
    StorageError,
    StoreResult,
} from "../../../../../z_vendor/getto-application/infra/storage/data"
import { Authz } from "../../../../../common/authz/data"
import { AuthnInfo, LastAuth, RenewRemoteError, AuthnNonce } from "./data"

export interface AuthnInfoRepository {
    load(): LoadLastAuthResult
    store(authnInfo: AuthnInfo): StoreResult
    remove(): StoreResult
}

export type LoadLastAuthResult =
    | Readonly<{ success: true; found: true; lastAuth: LastAuth }>
    | Readonly<{ success: true; found: false }>
    | Readonly<{ success: false; err: StorageError }>

export type RenewRemote = Remote<AuthnNonce, RenewResponse, RenewRemoteError>
export type RenewResult = RemoteResult<RenewResponse, RenewRemoteError>
export type RenewSimulator = RemoteSimulator<AuthnNonce, RenewResponse, RenewRemoteError>
export type RenewResponse = Readonly<{
    auth: AuthnInfo
    api: Authz
}>
