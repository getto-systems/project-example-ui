import { RenewClient, RenewResponse } from "../../../infra"

import { initTicketNonce, ticketNonceToString, initApiRoles } from "../../../../credential/adapter"

import { TicketNonce } from "../../../../credential/data"

interface AuthClient {
    renew(param: { nonce: string }): Promise<AuthRenewResponse>
}

type AuthRenewResponse =
    Readonly<{ success: true, authCredential: { ticketNonce: string, apiCredential: { apiRoles: Array<string> } } }> |
    Readonly<{ success: false, err: { type: string, err: string } }>

export function initFetchRenewClient(client: AuthClient): RenewClient {
    return new FetchRenewClient(client)
}

class FetchRenewClient implements RenewClient {
    client: AuthClient

    constructor(client: AuthClient) {
        this.client = client
    }

    async renew(ticketNonce: TicketNonce): Promise<RenewResponse> {
        try {
            const response = await this.client.renew({ nonce: ticketNonceToString(ticketNonce) })
            if (response.success) {
                return {
                    success: true,
                    hasCredential: true,
                    authCredential: {
                        ticketNonce: initTicketNonce(response.authCredential.ticketNonce),
                        apiCredential: {
                            apiRoles: initApiRoles(response.authCredential.apiCredential.apiRoles),
                        },
                    },
                }
            } else {
                switch (response.err.type) {
                    case "invalid-ticket":
                        return { success: true, hasCredential: false }

                    case "bad-request":
                    case "server-error":
                        return { success: false, err: { type: response.err.type } }

                    case "bad-response":
                        return { success: false, err: { type: "bad-response", err: response.err.err } }

                    default:
                        return { success: false, err: { type: "infra-error", err: response.err.err } }
                }
            }
        } catch (err) {
            return { success: false, err: { type: "infra-error", err } }
        }
    }
}
