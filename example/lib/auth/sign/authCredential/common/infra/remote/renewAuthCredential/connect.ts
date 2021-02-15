import { initConnectRemoteAccess } from "../../../../../../../z_infra/remote/connect"

import { RawRemoteAccess, RemoteAccessError } from "../../../../../../../z_infra/remote/infra"
import { RenewAuthCredentialRemoteAccess, RenewAuthCredentialRemoteResponse } from "../../../infra"

import { markAuthAt, markTicketNonce, RenewAuthCredentialRemoteError, TicketNonce } from "../../../data"
import { markApiNonce, markApiRoles } from "../../../../../../../common/apiCredential/data"

type Raw = RawRemoteAccess<TicketNonce, RawAuthCredential>
type RawAuthCredential = Readonly<{
    ticketNonce: string
    api: Readonly<{ apiNonce: string; apiRoles: string[] }>
}>

export function initRenewAuthCredentialConnectRemoteAccess(access: Raw): RenewAuthCredentialRemoteAccess {
    return initConnectRemoteAccess(access, {
        message: (nonce: TicketNonce): TicketNonce => nonce,
        value: (response: RawAuthCredential): RenewAuthCredentialRemoteResponse => {
            return {
                auth: {
                    ticketNonce: markTicketNonce(response.ticketNonce),
                    authAt: markAuthAt(new Date()),
                },
                api: {
                    apiNonce: markApiNonce(response.api.apiNonce),
                    apiRoles: markApiRoles(response.api.apiRoles),
                },
            }
        },
        error: (err: RemoteAccessError): RenewAuthCredentialRemoteError => {
            switch (err.type) {
                case "invalid-ticket":
                case "bad-request":
                case "server-error":
                    return { type: err.type }

                case "bad-response":
                    return { type: "bad-response", err: err.detail }

                default:
                    return { type: "infra-error", err: err.detail }
            }
        },
        unknown: (err: unknown): RenewAuthCredentialRemoteError => ({
            type: "infra-error",
            err: `${err}`,
        }),
    })
}
