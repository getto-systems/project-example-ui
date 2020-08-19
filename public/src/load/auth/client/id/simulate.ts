import { NonceValue, Credential, credentialUnauthorized, credentialAuthorized } from "../../data";
import { IDClient } from "../../infra";

export function initSimulateIDClient(): IDClient {
    return {
        async renew(nonce: NonceValue): Promise<Credential> {
            return credentialAuthorized(["admin", "development"]);
        },
    };
}
