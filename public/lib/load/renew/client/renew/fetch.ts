import { NonceValue } from "../../../credential/data";
import { RenewClient, Credential, credentialUnauthorized, credentialAuthorized } from "../../infra";

interface renewClient {
    renew(param: { nonce: string }): Promise<{ roles: Array<string> }>
}

export function initFetchRenewClient(authClient: renewClient): RenewClient {
    return {
        async renew(nonce: NonceValue): Promise<Credential> {
            try {
                const response = await authClient.renew({ nonce: nonce });
                return credentialAuthorized(response.roles);
            } catch (err) {
                switch (err) {
                    case "empty-nonce":
                    case "bad-response":
                    case "bad-request":
                    case "invalid-ticket":
                        return credentialUnauthorized(err);
                    default:
                        return credentialUnauthorized("server-error");
                }
            }
        },
    }
}
