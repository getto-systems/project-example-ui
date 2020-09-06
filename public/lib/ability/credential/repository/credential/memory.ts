import { CredentialRepository } from "../../infra";

import { Nonce, nonce, NonceValue, ApiRoles } from "../../data";

export function initMemoryCredentialRepository(initialNonce: Nonce): CredentialRepository {
    return new MemoryCredentialRepository(initialNonce);
}

class MemoryCredentialRepository implements CredentialRepository {
    data: { nonce: Nonce, roles: ApiRoles }

    constructor(initialNonce: Nonce) {
        this.data = {
            nonce: initialNonce,
            roles: { roles: [] },
        }
    }

    async findNonce(): Promise<Nonce> {
        return this.data.nonce;
    }
    async storeRoles(roles: ApiRoles): Promise<void> {
        this.data.roles = roles;
    }
    async storeNonce(value: NonceValue): Promise<void> {
        this.data.nonce = nonce(value);
    }
}
