import { CredentialRepository, NonceFound, nonceFound } from "../../infra";

import { NonceValue, ApiRoles } from "../../data";

export function initMemoryCredentialRepository(initialNonce: NonceFound): CredentialRepository {
    return new MemoryCredentialRepository(initialNonce);
}

class MemoryCredentialRepository implements CredentialRepository {
    data: { nonce: NonceFound, roles: ApiRoles }

    constructor(initialNonce: NonceFound) {
        this.data = {
            nonce: initialNonce,
            roles: { roles: [] },
        }
    }

    async findNonce(): Promise<NonceFound> {
        return this.data.nonce;
    }
    async storeRoles(roles: ApiRoles): Promise<void> {
        this.data.roles = roles;
    }
    async storeNonce(value: NonceValue): Promise<void> {
        this.data.nonce = nonceFound(value);
    }
}
