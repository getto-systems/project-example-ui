import { AuthCredentialRepository } from "../../../infra"

import { AuthCredential, StoreResult, LoadLastLoginResult } from "../../../data"

export function initMemoryAuthCredentialRepository(
    storage: AuthCredentialStorage
): AuthCredentialRepository {
    return new MemoryAuthCredentialRepository(storage)
}

export type AuthCredentialStorage =
    | Readonly<{ stored: false }>
    | Readonly<{ stored: true; authCredential: AuthCredential }>

class MemoryAuthCredentialRepository implements AuthCredentialRepository {
    storage: AuthCredentialStorage

    constructor(storage: AuthCredentialStorage) {
        this.storage = storage
    }

    findLastLogin(): LoadLastLoginResult {
        if (!this.storage.stored) {
            return { success: true, found: false }
        }
        return {
            success: true,
            found: true,
            lastLogin: {
                ticketNonce: this.storage.authCredential.ticketNonce,
                lastLoginAt: this.storage.authCredential.loginAt,
            },
        }
    }
    storeAuthCredential(authCredential: AuthCredential): StoreResult {
        this.storage = { stored: true, authCredential }
        return { success: true }
    }
    removeAuthCredential(): StoreResult {
        this.storage = { stored: false }
        return { success: true }
    }
}
