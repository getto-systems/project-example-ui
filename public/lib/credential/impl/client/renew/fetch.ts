import { RenewClient, RenewResponse } from "../../../infra"

import {
    packTicketNonce,
    unpackTicketNonce,
    packApiRoles,
    packAuthAt,
} from "../../../../credential/adapter"

import { TicketNonce } from "../../../../credential/data"

interface AuthClient {
    renew(param: { nonce: string }): Promise<AuthRenewResponse>
}

type AuthRenewResponse =
    | Readonly<{
          success: true
          authCredential: { ticketNonce: string; apiCredential: { apiRoles: string[] } }
      }>
    | Readonly<{ success: false; err: { type: string; err: string } }>

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
            const response = await this.client.renew({ nonce: unpackTicketNonce(ticketNonce) })
            if (response.success === true) {
                return {
                    success: true,
                    hasCredential: true,
                    authCredential: {
                        ticketNonce: packTicketNonce(response.authCredential.ticketNonce),
                        apiCredential: {
                            apiRoles: packApiRoles(response.authCredential.apiCredential.apiRoles),
                        },
                        authAt: packAuthAt(new Date()),
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
            return { success: false, err: { type: "infra-error", err: `${err}` } }
        }
    }
}
