import { TypedStorage } from "../../../../../../z_infra/storage/infra"
import { AuthCredentialRepository, StoreResult, LoadLastLoginResult } from "../../infra"

import {
    AuthAt,
    AuthCredential,
    markAuthAt,
    markTicketNonce,
    StorageError,
    TicketNonce,
} from "../../data"

export type AuthCredentialStorage = Readonly<{
    ticketNonce: TypedStorage<TicketNonce>
    lastAuthAt: TypedStorage<AuthAt>
}>
export function initAuthCredentialRepository(storage: AuthCredentialStorage): AuthCredentialRepository {
    return new Repository(storage)
}

class Repository implements AuthCredentialRepository {
    storage: AuthCredentialStorage

    constructor(storage: AuthCredentialStorage) {
        this.storage = storage
    }

    load(): LoadLastLoginResult {
        try {
            const ticketNonce = findCredential(this.storage.ticketNonce)
            if (!ticketNonce.found) {
                return { success: true, found: false }
            }

            const lastAuthAt = findCredential(this.storage.lastAuthAt)
            if (!lastAuthAt.found) {
                return { success: true, found: false }
            }

            const lastLogin = {
                ticketNonce: markTicketNonce(ticketNonce.value),
                lastAuthAt: markAuthAt(lastAuthAt.value),
            }

            return { success: true, found: true, lastLogin }
        } catch (err) {
            return storageError(err)
        }
    }

    store(authCredential: AuthCredential): StoreResult {
        try {
            this.storage.ticketNonce.set(authCredential.ticketNonce)
            this.storage.lastAuthAt.set(authCredential.authAt)
            return { success: true }
        } catch (err) {
            return storageError(err)
        }
    }
    remove(): StoreResult {
        try {
            this.storage.ticketNonce.remove()
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
