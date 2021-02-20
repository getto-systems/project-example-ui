import { Remote, RemoteResult, RemoteSimulator } from "../../../../../z_getto/infra/remote/infra"
import { StoreResult } from "../../../../../common/storage/infra"

import { StorageError } from "../../../../../common/storage/data"
import { ApiCredential } from "../../../../../common/apiCredential/data"
import { AuthnInfo, LastAuth, RenewAuthnInfoRemoteError, AuthnNonce } from "./data"

export interface AuthnInfoRepository {
    load(): LoadLastAuthResult
    store(authnInfo: AuthnInfo): StoreResult
    remove(): StoreResult
}

export type LoadLastAuthResult =
    | Readonly<{ success: true; found: true; lastAuth: LastAuth }>
    | Readonly<{ success: true; found: false }>
    | Readonly<{ success: false; err: StorageError }>

export type RenewAuthnInfoRemote = Remote<
    AuthnNonce,
    RenewAuthnInfoResponse,
    RenewAuthnInfoRemoteError
>
export type RenewAuthnInfoResult = RemoteResult<
    RenewAuthnInfoResponse,
    RenewAuthnInfoRemoteError
>
export type RenewAuthnInfoSimulator = RemoteSimulator<
    AuthnNonce,
    RenewAuthnInfoResponse,
    RenewAuthnInfoRemoteError
>
export type RenewAuthnInfoResponse = Readonly<{
    auth: AuthnInfo
    api: ApiCredential
}>
