import { TypedStorage } from "../../../../../../../../z_vendor/getto-application/storage/typed/infra"
import { StoreResult } from "../../../../../../../../z_vendor/getto-application/storage/infra"
import { AuthnInfoRepository, LoadLastAuthResult } from "../../../infra"

import { StorageError } from "../../../../../../../../z_vendor/getto-application/storage/data"
import {
    AuthAt,
    AuthnInfo,
    markAuthAt,
    markAuthnNonce,
    AuthnNonce,
    LastAuth,
} from "../../../data"

export type AuthnInfoStorage = Readonly<{
    authnNonce: TypedStorage<AuthnNonce>
    lastAuthAt: TypedStorage<AuthAt>
}>
export function initAuthnInfoRepository(storage: AuthnInfoStorage): AuthnInfoRepository {
    return new Repository(storage)
}

class Repository implements AuthnInfoRepository {
    storage: AuthnInfoStorage

    constructor(storage: AuthnInfoStorage) {
        this.storage = storage
    }

    load(): LoadLastAuthResult {
        try {
            const authnNonce = findCredential(this.storage.authnNonce)
            if (!authnNonce.found) {
                return { success: true, found: false }
            }

            const lastAuthAt = findCredential(this.storage.lastAuthAt)
            if (!lastAuthAt.found) {
                return { success: true, found: false }
            }

            const lastAuth: LastAuth = {
                authnNonce: markAuthnNonce(authnNonce.value),
                lastAuthAt: markAuthAt(lastAuthAt.value),
            }

            return { success: true, found: true, lastAuth }
        } catch (err) {
            return storageError(err)
        }
    }

    store(authnInfo: AuthnInfo): StoreResult {
        try {
            this.storage.authnNonce.set(authnInfo.authnNonce)
            this.storage.lastAuthAt.set(authnInfo.authAt)
            return { success: true }
        } catch (err) {
            return storageError(err)
        }
    }
    remove(): StoreResult {
        try {
            this.storage.authnNonce.remove()
            this.storage.lastAuthAt.remove()
            return { success: true }
        } catch (err) {
            return storageError(err)
        }
    }
}

function findCredential<T>(storage: TypedStorage<T>): Found<T> {
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
