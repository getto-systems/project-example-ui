import { NonceValue } from "../../../credential/data";
import { RenewClient, Credential, credentialUnauthorized, credentialAuthorized } from "../../infra";
import { AuthClient } from "../../../../z_external/auth_client";

export function initFetchRenewClient(authClient: AuthClient): RenewClient {
    return {
        async renew(nonce: NonceValue): Promise<Credential> {
            const response = await authClient.renew({ nonce: nonce });
            if (response.success) {
                return credentialAuthorized(response.roles);
            } else {
                switch (response.message) {
                    case "empty-nonce":
                    case "bad-request":
                    case "bad-response":
                    case "invalid-ticket":
                        return credentialUnauthorized(response.message);
                    default:
                        return credentialUnauthorized("server-error");
                }
            }
        },
    }
}
