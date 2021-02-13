import { initConnectRemoteAccess } from "../../../../../../../z_infra/remote/connect"

import { RawRemoteAccess, RemoteAccessError } from "../../../../../../../z_infra/remote/infra"
import { RenewRemoteAccess, RenewRemoteResponse } from "../../../infra"

import {
    markAuthAt,
    markTicketNonce,
    RenewRemoteError,
    TicketNonce,
} from "../../../data"
import { markApiNonce, markApiRoles } from "../../../../../../../common/auth/apiCredential/data"

type RenewRawRemoteAccess = RawRemoteAccess<TicketNonce, RawAuthCredential>
type RawAuthCredential = Readonly<{
    ticketNonce: string
    api: Readonly<{ apiNonce: string; apiRoles: string[] }>
}>

export function initRenewConnectRemoteAccess(access: RenewRawRemoteAccess): RenewRemoteAccess {
    return initConnectRemoteAccess(access, {
        message: (nonce: TicketNonce): TicketNonce => nonce,
        value: (response: RawAuthCredential): RenewRemoteResponse => {
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
        error: (err: RemoteAccessError): RenewRemoteError => {
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
        unknown: (err: unknown): RenewRemoteError => ({ type: "infra-error", err: `${err}` }),
    })
}
