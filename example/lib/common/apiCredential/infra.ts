import { StoreResult } from "../../z_getto/storage/infra"

import { StorageError } from "../../z_getto/storage/data"
import { ApiCredential } from "./data"

export interface ApiCredentialRepository {
    load(): LoadApiCredentialResult
    store(authnInfo: ApiCredential): StoreResult
    remove(): StoreResult
}

export type LoadApiCredentialResult =
    | Readonly<{ success: true; found: true; apiCredential: ApiCredential }>
    | Readonly<{ success: true; found: false }>
    | Readonly<{ success: false; err: StorageError }>
