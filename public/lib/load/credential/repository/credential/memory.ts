import { Nonce, nonce, NonceValue, ApiRoles } from "../../data";
import { CredentialRepository } from "../../infra";

export function initMemoryCredential(initialNonce: Nonce): CredentialRepository {
    const data: { nonce: Nonce, roles: ApiRoles } = {
        nonce: initialNonce,
        roles: { roles: [] },
    };

    return {
        findNonce,
        storeRoles,
        storeNonce,
    }

    async function findNonce(): Promise<Nonce> {
        return data.nonce;
    }
    async function storeRoles(roles: ApiRoles): Promise<void> {
        data.roles = roles;
    }
    async function storeNonce(value: NonceValue): Promise<void> {
        data.nonce = nonce(value);
    }
}
