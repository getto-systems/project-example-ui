import { ApiCredential, StorageError } from "./data"

export interface ApiCredentialRepository {
    load(): LoadApiCredentialResult
    store(authCredential: ApiCredential): StoreResult
    remove(): StoreResult
}

export type LoadApiCredentialResult =
    | Readonly<{ success: true; found: true; apiCredential: ApiCredential }>
    | Readonly<{ success: true; found: false }>
    | Readonly<{ success: false; err: StorageError }>

export type StoreResult = Readonly<{ success: true }> | Readonly<{ success: false; err: StorageError }>
