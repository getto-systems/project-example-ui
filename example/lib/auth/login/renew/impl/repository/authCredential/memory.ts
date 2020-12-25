import { AuthCredentialRepository, StoreResult, LoadLastLoginResult } from "../../../infra"

import { AuthCredential } from "../../../../../common/credential/data"

export function initMemoryAuthCredentialRepository(
    storage: AuthCredentialStore
): AuthCredentialRepository {
    return new MemoryAuthCredentialRepository(storage)
}

export type AuthCredentialStore =
    | Readonly<{ stored: false }>
    | Readonly<{ stored: true; authCredential: AuthCredential }>

class MemoryAuthCredentialRepository implements AuthCredentialRepository {
    store: AuthCredentialStore

    constructor(store: AuthCredentialStore) {
        this.store = store
    }

    findLastLogin(): LoadLastLoginResult {
        if (!this.store.stored) {
            return { success: true, found: false }
        }
        return {
            success: true,
            found: true,
            lastLogin: {
                ticketNonce: this.store.authCredential.ticketNonce,
                lastAuthAt: this.store.authCredential.authAt,
            },
        }
    }
    storeAuthCredential(authCredential: AuthCredential): StoreResult {
        this.store = { stored: true, authCredential }
        return { success: true }
    }
    removeAuthCredential(): StoreResult {
        this.store = { stored: false }
        return { success: true }
    }
}
