import { TypedStorage } from "../../../../../z_infra/storage/infra"
import { AuthCredentialRepository, StoreResult, LoadLastLoginResult } from "../../infra"

import {
    markAuthAt,
    markTicketNonce,
    AuthCredential,
    ApiCredential_data,
} from "../../../../common/credential/data"

export type AuthCredentialStorage = Readonly<{
    ticketNonce: TypedStorage<string>
    apiCredential: TypedStorage<ApiCredential_data>
    lastAuthAt: TypedStorage<Date>
}>
export function initAuthCredentialRepository(storage: AuthCredentialStorage): AuthCredentialRepository {
    return new Repository(storage)
}

class Repository implements AuthCredentialRepository {
    storage: AuthCredentialStorage

    constructor(storage: AuthCredentialStorage) {
        this.storage = storage
    }

    findLastLogin(): LoadLastLoginResult {
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
            return { success: false, err: { type: "infra-error", err: `${err}` } }
        }
    }

    storeAuthCredential(authCredential: AuthCredential): StoreResult {
        try {
            this.storage.ticketNonce.set(authCredential.ticketNonce)
            this.storage.apiCredential.set(authCredential.apiCredential)
            this.storage.lastAuthAt.set(authCredential.authAt)
            return { success: true }
        } catch (err) {
            return { success: false, err: { type: "infra-error", err: `${err}` } }
        }
    }
    removeAuthCredential(): StoreResult {
        try {
            this.storage.ticketNonce.remove()
            this.storage.apiCredential.remove()
            this.storage.lastAuthAt.remove()
            return { success: true }
        } catch (err) {
            return { success: false, err: { type: "infra-error", err: `${err}` } }
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

type Found<T> = Readonly<{ found: false }> | Readonly<{ found: true; value: T }>
