import { StoreResult } from "../storage/infra"

import { StorageError } from "../storage/data"
import { ApiCredential } from "./data"

export interface ApiCredentialRepository {
    load(): LoadApiCredentialResult
    store(authCredential: ApiCredential): StoreResult
    remove(): StoreResult
}

export type LoadApiCredentialResult =
    | Readonly<{ success: true; found: true; apiCredential: ApiCredential }>
    | Readonly<{ success: true; found: false }>
    | Readonly<{ success: false; err: StorageError }>
