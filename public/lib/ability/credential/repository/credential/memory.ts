import { CredentialRepository, TicketNonceFound, ticketNonceFound } from "../../infra";

import { NonceValue, ApiRoles } from "../../data";

export function initMemoryCredentialRepository(initialNonce: TicketNonceFound): CredentialRepository {
    return new MemoryCredentialRepository(initialNonce);
}

class MemoryCredentialRepository implements CredentialRepository {
    data: { nonce: TicketNonceFound, roles: ApiRoles }

    constructor(initialNonce: TicketNonceFound) {
        this.data = {
            nonce: initialNonce,
            roles: { roles: [] },
        }
    }

    async findNonce(): Promise<TicketNonceFound> {
        return this.data.nonce;
    }
    async storeRoles(roles: ApiRoles): Promise<void> {
        this.data.roles = roles;
    }
    async storeNonce(value: NonceValue): Promise<void> {
        this.data.nonce = ticketNonceFound(value);
    }
}
