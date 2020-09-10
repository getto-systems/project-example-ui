import { AuthCredentialRepository, TicketNonceFound, ticketNonceFound } from "../../infra";

import { AuthCredential, ApiCredential } from "../../data";

export function initMemoryAuthCredentialRepository(initialNonce: TicketNonceFound): AuthCredentialRepository {
    return new MemoryAuthCredentialRepository(initialNonce);
}

class MemoryAuthCredentialRepository implements AuthCredentialRepository {
    data: { ticketNonce: TicketNonceFound, apiCredential: ApiCredential }

    constructor(initialNonce: TicketNonceFound) {
        this.data = {
            ticketNonce: initialNonce,
            apiCredential: {
                apiRoles: { apiRoles: [] },
            },
        }
    }

    async findTicketNonce(): Promise<TicketNonceFound> {
        return this.data.ticketNonce;
    }
    async storeAuthCredential(authCredential: AuthCredential): Promise<void> {
        this.data.ticketNonce = ticketNonceFound(authCredential.ticketNonce);
        this.data.apiCredential = authCredential.apiCredential;
    }
}
