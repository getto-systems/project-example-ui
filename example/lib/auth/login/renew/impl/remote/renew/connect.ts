import { RenewRemoteAccess } from "../../../infra"

import {
    TicketNonce,
    markTicketNonce,
    markAuthAt,
    markApiCredential,
    AuthCredential,
} from "../../../../../common/credential/data"
import { RawRemoteAccess, RemoteAccessError } from "../../../../../../z_infra/remote/infra"
import { initConnectRemoteAccess } from "../../../../../../z_infra/remote/connect"
import { RenewRemoteError } from "../../../data"

type RenewRawRemoteAccess = RawRemoteAccess<TicketNonce, RawAuthCredential>
type RawAuthCredential = Readonly<{
    ticketNonce: string
    apiCredential: Readonly<{ apiRoles: string[] }>
}>

export function initRenewConnectRemoteAccess(access: RenewRawRemoteAccess): RenewRemoteAccess {
    return initConnectRemoteAccess(access, {
        message: (nonce: TicketNonce): TicketNonce => nonce,
        value: (response: RawAuthCredential): AuthCredential => {
            return {
                ticketNonce: markTicketNonce(response.ticketNonce),
                apiCredential: markApiCredential({
                    apiRoles: response.apiCredential.apiRoles,
                }),
                authAt: markAuthAt(new Date()),
            }
        },
        error: (err: RemoteAccessError): RenewRemoteError => {
            switch (err.type) {
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
