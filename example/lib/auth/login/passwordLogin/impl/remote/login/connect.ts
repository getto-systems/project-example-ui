import { initConnectRemoteAccess } from "../../../../../../z_infra/remote/connect"

import { LoginRemoteAccess } from "../../../infra"

import { LoginFields, LoginRemoteError } from "../../../data"
import {
    markTicketNonce,
    markAuthAt,
    markApiCredential,
    AuthCredential,
} from "../../../../../common/credential/data"
import { RawRemoteAccess, RemoteAccessError } from "../../../../../../z_infra/remote/infra"

export type LoginRawRemoteAccess = RawRemoteAccess<LoginFields, RawAuthCredential>
export type RawAuthCredential = Readonly<{
    ticketNonce: string
    apiCredential: Readonly<{ apiRoles: string[] }>
}>

export function initConnectLoginRemoteAccess(access: LoginRawRemoteAccess): LoginRemoteAccess {
    return initConnectRemoteAccess(access, {
        value: (response: RawAuthCredential): AuthCredential => ({
            ticketNonce: markTicketNonce(response.ticketNonce),
            apiCredential: markApiCredential({
                apiRoles: response.apiCredential.apiRoles,
            }),
            authAt: markAuthAt(new Date()),
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
