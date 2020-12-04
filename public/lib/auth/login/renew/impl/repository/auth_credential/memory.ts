import { AuthCredentialRepository, FindResponse, StoreResponse } from "../../../infra"

import { AuthCredential, TicketNonce, LoginAt } from "../../../../../common/credential/data"

export function initMemoryAuthCredentialRepository(): AuthCredentialRepository {
    return new MemoryAuthCredentialRepository()
}
export function initMemoryAuthCredentialRepositoryWithInitial(
    authCredential: AuthCredential
): AuthCredentialRepository {
    const repository = new MemoryAuthCredentialRepository()
    repository.storeAuthCredential(authCredential)
    return repository
}

class MemoryAuthCredentialRepository implements AuthCredentialRepository {
    store: Store<AuthCredential> = { stored: false }

    findTicketNonce(): FindResponse<TicketNonce> {
        return this.find(toTicketNonce)
    }
    findLastLoginAt(): FindResponse<LoginAt> {
        return this.find(toLoginAt)
    }
    find<T>(getter: { (authCredential: AuthCredential): T }): FindResponse<T> {
        if (!this.store.stored) {
            return { success: true, found: false }
        }
        return { success: true, found: true, content: getter(this.store.data) }
    }
    storeAuthCredential(authCredential: AuthCredential): StoreResponse {
        this.store = { stored: true, data: authCredential }
        return { success: true }
    }
    removeAuthCredential(): StoreResponse {
        this.store = { stored: false }
        return { success: true }
    }
}

type Store<T> = Readonly<{ stored: false }> | Readonly<{ stored: true; data: T }>

function toTicketNonce(authCredential: AuthCredential): TicketNonce {
    return authCredential.ticketNonce
}
function toLoginAt(authCredential: AuthCredential): LoginAt {
    return authCredential.loginAt
}
