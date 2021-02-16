import {
    RemoteAccess,
    RemoteAccessResult,
    RemoteAccessSimulator,
} from "../../../../z_infra/remote/infra"
import { StoreResult } from "../../../../common/storage/infra"

import { StorageError } from "../../../../common/storage/data"
import { ApiCredential } from "../../../../common/apiCredential/data"
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

export type RenewAuthnInfoRemoteAccess = RemoteAccess<
    AuthnNonce,
    RenewAuthnInfoRemoteResponse,
    RenewAuthnInfoRemoteError
>
export type RenewAuthnInfoRemoteAccessResult = RemoteAccessResult<
    RenewAuthnInfoRemoteResponse,
    RenewAuthnInfoRemoteError
>
export type RenewAuthnInfoSimulator = RemoteAccessSimulator<
    AuthnNonce,
    RenewAuthnInfoRemoteResponse,
    RenewAuthnInfoRemoteError
>
export type RenewAuthnInfoRemoteResponse = Readonly<{
    auth: AuthnInfo
    api: ApiCredential
}>
