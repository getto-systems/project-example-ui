import { TypedStorage } from "../../../../z_getto/infra/storage/infra"
import { StoreResult } from "../../../storage/infra"
import { ApiCredentialRepository, LoadApiCredentialResult } from "../../infra"

import { StorageError } from "../../../storage/data"
import { ApiCredential } from "../../data"

export type ApiCredentialStorage = Readonly<{
    apiCredential: TypedStorage<ApiCredential>
}>
export function initApiCredentialRepository(storage: ApiCredentialStorage): ApiCredentialRepository {
    return new Repository(storage)
}

class Repository implements ApiCredentialRepository {
    storage: ApiCredentialStorage

    constructor(storage: ApiCredentialStorage) {
        this.storage = storage
    }

    load(): LoadApiCredentialResult {
        try {
            const result = loadCredential(this.storage.apiCredential)
            if (!result.found) {
                return { success: true, found: false }
            }

            return { success: true, found: true, apiCredential: result.value }
        } catch (err) {
            return storageError(err)
        }
    }

    store(apiCredential: ApiCredential): StoreResult {
        try {
            this.storage.apiCredential.set(apiCredential)
            return { success: true }
        } catch (err) {
            return storageError(err)
        }
    }
    remove(): StoreResult {
        try {
            this.storage.apiCredential.remove()
            return { success: true }
        } catch (err) {
            return storageError(err)
        }
    }
}

function loadCredential<T>(storage: TypedStorage<T>): Found<T> {
    const result = storage.get()
    if (!result.found) {
        return { found: false }
    }
    if (result.decodeError) {
        storage.remove()
        return { found: false }
    }
    return result
}

function storageError(err: unknown): { success: false; err: StorageError } {
    return { success: false, err: { type: "infra-error", err: `${err}` } }
}

type Found<T> = Readonly<{ found: false }> | Readonly<{ found: true; value: T }>
