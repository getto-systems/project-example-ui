import { AuthCredentialRepository, FindResponse, StoreResponse } from "../../../infra"

import { AuthCredential, TicketNonce, ApiCredential, AuthAt } from "../../../../credential/data"

export function initMemoryAuthCredentialRepository(initialTicketNonce: TicketNonce, lastAuthAt: AuthAt): AuthCredentialRepository {
    return new MemoryAuthCredentialRepository(initialTicketNonce, lastAuthAt)
}

class MemoryAuthCredentialRepository implements AuthCredentialRepository {
    data: {
        ticketNonce: TicketNonce
        apiCredential: ApiCredential
        lastAuthAt: AuthAt
    }

    constructor(initialTicketNonce: TicketNonce, lastAuthAt: AuthAt) {
        this.data = {
            ticketNonce: initialTicketNonce,
            apiCredential: {
                apiRoles: [],
            },
            lastAuthAt,
        }
    }

    findTicketNonce(): FindResponse<TicketNonce> {
        return { success: true, found: true, content: this.data.ticketNonce }
    }
    findLastAuthAt(): FindResponse<AuthAt> {
        return { success: true, found: true, content: this.data.lastAuthAt }
    }
    storeAuthCredential(authCredential: AuthCredential): StoreResponse {
        this.data.ticketNonce = authCredential.ticketNonce
        this.data.apiCredential = authCredential.apiCredential
        this.data.lastAuthAt = authCredential.authAt
        return { success: true }
    }
}
