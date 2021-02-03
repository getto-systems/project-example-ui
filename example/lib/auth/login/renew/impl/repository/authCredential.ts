import { decodeSuccess, TypedStorage, TypedStorageConverter } from "../../../../../z_infra/storage/infra"
import { AuthCredentialRepository, StoreResult, LoadLastLoginResult } from "../../infra"

import {
    markAuthAt,
    markTicketNonce,
    AuthCredential,
    TicketNonce,
    ApiCredential,
    AuthAt,
    markApiCredential,
} from "../../../../common/credential/data"
import { combineConverter } from "../../../../../z_infra/storage/converter/combine"
import { initApiCredentialDataConverter } from "../../../../../z_external/converter/apiCredential"
import { initDateConverter } from "../../../../../z_infra/storage/converter/date"

export type AuthCredentialStorage = Readonly<{
    ticketNonce: TypedStorage<TicketNonce>
    apiCredential: TypedStorage<ApiCredential>
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

export function initTicketNonceConverter(): TypedStorageConverter<TicketNonce> {
    return {
        encode: (value) => value,
        decode: (value) => decodeSuccess(markTicketNonce(value)),
    }
}
export function initApiCredentialConverter(): TypedStorageConverter<ApiCredential> {
    return combineConverter(initApiCredentialDataConverter(), {
        encode: (value) => value,
        decode: (value) => decodeSuccess(markApiCredential(value)),
    })
}
export function initLastAuthAtConverter(): TypedStorageConverter<AuthAt> {
    return combineConverter(initDateConverter(), {
        encode: (value) => value,
        decode: (value) => decodeSuccess(markAuthAt(value)),
    })
}
