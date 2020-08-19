import { Nonce, nonce, NonceValue, ApiRoles, apiRoles } from "../../data";
import { CredentialRepository, Success, success } from "../../infra";

export function initMemoryCredential(initialNonce: Nonce): CredentialRepository {
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
        async storeNonce(value: NonceValue): Promise<Success> {
            data.nonce = nonce(value);
            return success;
        },
    };
}
