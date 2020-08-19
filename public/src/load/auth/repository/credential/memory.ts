import { Nonce, ApiRoles, apiRoles, Success, success } from "../../data";
import { CredentialRepository } from "../../infra";

export interface CredentialRepositorySimulate extends CredentialRepository {
    setNonce(nonce: Nonce): void;
}

export function initMemoryCredential(initialNonce: Nonce): CredentialRepositorySimulate {
    const data = {
        nonce: initialNonce,
        roles: apiRoles([]),
    };

    return {
        async findNonce(): Promise<Nonce> {
            return data.nonce;
        },
        async storeRoles(roles: ApiRoles): Promise<Success> {
            data.roles = roles;
            return success;
        },

        setNonce(nonce: Nonce) {
            data.nonce = nonce;
        },
    };
}
