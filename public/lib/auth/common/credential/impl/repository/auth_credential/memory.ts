import { AuthCredentialRepository, FindResponse, StoreResponse } from "../../../infra"

import { AuthCredential, TicketNonce, LoginAt } from "../../../data"

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

    findTicketNonce(): FindResponse<TicketNonce> {
        return this.find(toTicketNonce)
    }
    findLastLoginAt(): FindResponse<LoginAt> {
        return this.find(toLoginAt)
    }
    find<T>(getter: { (authCredential: AuthCredential): T }): FindResponse<T> {
        if (!this.storage.stored) {
            return { success: true, found: false }
        }
        return { success: true, found: true, content: getter(this.storage.authCredential) }
    }
    storeAuthCredential(authCredential: AuthCredential): StoreResponse {
        this.storage = { stored: true, authCredential }
        return { success: true }
    }
    removeAuthCredential(): StoreResponse {
        this.storage = { stored: false }
        return { success: true }
    }
}

function toTicketNonce(authCredential: AuthCredential): TicketNonce {
    return authCredential.ticketNonce
}
function toLoginAt(authCredential: AuthCredential): LoginAt {
    return authCredential.loginAt
}
