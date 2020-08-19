import { NonceValue, ApiRoles } from "../../../credential/data";
import { RenewClient, Credential, credentialUnauthorized, credentialAuthorized } from "../../infra";

export function initSimulateRenewClient(targetNonce: NonceValue, roles: ApiRoles): RenewClient {
    return {
        async renew(nonce: NonceValue): Promise<Credential> {
            if (nonce !== targetNonce) {
                return credentialUnauthorized;
            }

            return credentialAuthorized(roles);
        },
    };
}
