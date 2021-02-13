import { initConnectRemoteAccess } from "../../../../../../z_infra/remote/connect"

import { LoginRemoteAccess, LoginRemoteResponse } from "../../../infra"

import { LoginFields, LoginRemoteError } from "../../../data"
import { RawRemoteAccess, RemoteAccessError } from "../../../../../../z_infra/remote/infra"
import { markAuthAt, markTicketNonce } from "../../../../authCredential/common/data"
import { markApiNonce, markApiRoles } from "../../../../../../common/auth/apiCredential/data"

type LoginRawRemoteAccess = RawRemoteAccess<LoginFields, RawAuthCredential>
type RawAuthCredential = Readonly<{
    ticketNonce: string
    api: Readonly<{ apiNonce: string; apiRoles: string[] }>
}>

export function initLoginConnectRemoteAccess(access: LoginRawRemoteAccess): LoginRemoteAccess {
    return initConnectRemoteAccess(access, {
        message: (fields: LoginFields): LoginFields => fields,
        value: (response: RawAuthCredential): LoginRemoteResponse => ({
            auth: { ticketNonce: markTicketNonce(response.ticketNonce), authAt: markAuthAt(new Date()) },
            api: {
                apiNonce: markApiNonce(response.api.apiNonce),
                apiRoles: markApiRoles(response.api.apiRoles),
            },
        }),
        error: (err: RemoteAccessError): LoginRemoteError => {
            switch (err.type) {
                case "bad-request":
                case "invalid-password-login":
                case "server-error":
                    return { type: err.type }

                case "bad-response":
                    return { type: "bad-response", err: err.detail }

                default:
                    return { type: "infra-error", err: err.detail }
            }
        },
        unknown: (err: unknown): LoginRemoteError => ({ type: "infra-error", err: `${err}` }),
    })
}
