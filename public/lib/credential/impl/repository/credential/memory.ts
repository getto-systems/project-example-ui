import { AuthCredentialRepository, FindResponse, StoreResponse } from "../../../infra"

import { AuthCredential, TicketNonce, ApiCredential } from "../../../data"

export function initMemoryAuthCredentialRepository(initialNonce: TicketNonce): AuthCredentialRepository {
    return new MemoryAuthCredentialRepository(initialNonce)
}

class MemoryAuthCredentialRepository implements AuthCredentialRepository {
    data: { ticketNonce: TicketNonce, apiCredential: ApiCredential }

    constructor(initialNonce: TicketNonce) {
        this.data = {
            ticketNonce: initialNonce,
            apiCredential: {
                apiRoles: [],
            },
        }
    }

    findTicketNonce(): FindResponse {
        return { success: true, found: true, ticketNonce: this.data.ticketNonce }
    }
    storeAuthCredential(authCredential: AuthCredential): StoreResponse {
        this.data.ticketNonce = authCredential.ticketNonce
        this.data.apiCredential = authCredential.apiCredential
        return { success: true }
    }
}
