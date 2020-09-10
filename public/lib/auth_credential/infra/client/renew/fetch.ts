import { RenewClient, RenewResponse, renewSuccess, renewFailed } from "../../../infra";

import { TicketNonce } from "../../../../auth_credential/data";

interface AuthClient {
    renew(param: { nonce: string }): Promise<AuthRenewResponse>
}

type AuthRenewResponse =
    Readonly<{ success: true, authCredential: { ticketNonce: string, apiCredential: { apiRoles: Array<string> } } }> |
    Readonly<{ success: false, err: { type: string, err: string } }>

export function initFetchRenewClient(client: AuthClient): RenewClient {
    return new FetchRenewClient(client);
}

class FetchRenewClient implements RenewClient {
    client: AuthClient

    constructor(client: AuthClient) {
        this.client = client;
    }

    async renew(ticketNonce: TicketNonce): Promise<RenewResponse> {
        try {
            const response = await this.client.renew({ nonce: ticketNonce.ticketNonce });
            if (response.success) {
                return renewSuccess({
                    ticketNonce: { ticketNonce: response.authCredential.ticketNonce },
                    apiCredential: {
                        apiRoles: { apiRoles: response.authCredential.apiCredential.apiRoles },
                    },
                });
            } else {
                switch (response.err.type) {
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
