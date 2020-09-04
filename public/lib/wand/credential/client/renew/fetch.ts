import { RenewClient, RenewResponse, renewSuccess, renewFailed } from "../../infra";

import { NonceValue } from "../../../credential/data";

interface AuthClient {
    renew(param: { nonce: string }): Promise<AuthRenewResponse>
}

type AuthRenewResponse =
    Readonly<{ success: true, roles: Array<string> }> |
    Readonly<{ success: false, err: { type: string, err: string } }>

export function initFetchRenewClient(authClient: AuthClient): RenewClient {
    return {
        renew,
    }

    async function renew(nonce: NonceValue): Promise<RenewResponse> {
        try {
            const response = await authClient.renew({ nonce: nonce.nonce });
            if (response.success) {
                return renewSuccess({ roles: Array.from(response.roles) });
            } else {
                switch (response.err.type) {
                    case "empty-nonce":
                    case "bad-request":
                    case "invalid-ticket":
                    case "server-error":
                        return renewFailed({ type: response.err.type });

                    case "bad-response":
                        return renewFailed({ type: "bad-response", err: response.err.err });

                    default:
                        return renewFailed({ type: "infra-error", err: response.err.err });
                }
            }
        } catch (err) {
            return renewFailed({ type: "infra-error", err });
        }
    }
}
