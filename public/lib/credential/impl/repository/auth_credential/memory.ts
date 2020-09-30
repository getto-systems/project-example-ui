import { AuthCredentialRepository, FindResponse, StoreResponse } from "../../../infra"

import { AuthCredential, TicketNonce, ApiCredential, AuthAt } from "../../../../credential/data"

export function initMemoryAuthCredentialRepository(initialTicketNonce: TicketNonce, lastAuthAt: AuthAt): AuthCredentialRepository {
    return new MemoryAuthCredentialRepository(initialTicketNonce, lastAuthAt)
}

class MemoryAuthCredentialRepository implements AuthCredentialRepository {
    data: {
        ticketNonce: Found<TicketNonce>
        apiCredential: Found<ApiCredential>
        lastAuthAt: Found<AuthAt>
    }

    constructor(initialTicketNonce: TicketNonce, lastAuthAt: AuthAt) {
        this.data = {
            ticketNonce: { found: true, content: initialTicketNonce },
            apiCredential: {
                found: true,
                content: {
                    apiRoles: [],
                },
            },
            lastAuthAt: { found: true, content: lastAuthAt },
        }
    }

    findTicketNonce(): FindResponse<TicketNonce> {
        return { success: true, ...this.data.ticketNonce }
    }
    findLastAuthAt(): FindResponse<AuthAt> {
        return { success: true, ...this.data.lastAuthAt }
    }
    storeAuthCredential(authCredential: AuthCredential): StoreResponse {
        this.data.ticketNonce = { found: true, content: authCredential.ticketNonce }
        this.data.apiCredential = { found: true, content: authCredential.apiCredential }
        this.data.lastAuthAt = { found: true, content: authCredential.authAt }
        return { success: true }
    }
    removeAuthCredential(): StoreResponse {
        this.data.ticketNonce = { found: false }
        this.data.apiCredential = { found: false }
        this.data.lastAuthAt = { found: false }
        return { success: true }
    }
}

type Found<T> =
    Readonly<{ found: false }> |
    Readonly<{ found: true, content: T }>
