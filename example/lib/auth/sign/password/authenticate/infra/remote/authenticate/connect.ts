import { initConnectRemoteAccess } from "../../../../../../../z_infra/remote/connect"

import { AuthenticatePasswordRemoteAccess, AuthenticatePasswordRemoteResponse } from "../../../infra"

import { PasswordLoginFields, AuthenticatePasswordRemoteError } from "../../../data"
import { RawRemoteAccess, RemoteAccessError } from "../../../../../../../z_infra/remote/infra"
import { markAuthAt, markTicketNonce } from "../../../../../authCredential/common/data"
import { markApiNonce, markApiRoles } from "../../../../../../../common/apiCredential/data"

type Raw = RawRemoteAccess<PasswordLoginFields, RawAuthCredential>
type RawAuthCredential = Readonly<{
    ticketNonce: string
    api: Readonly<{ apiNonce: string; apiRoles: string[] }>
}>

export function initAuthenticatePasswordConnectRemoteAccess(
    access: Raw
): AuthenticatePasswordRemoteAccess {
    return initConnectRemoteAccess(access, {
        message: (fields: PasswordLoginFields): PasswordLoginFields => fields,
        value: (response: RawAuthCredential): AuthenticatePasswordRemoteResponse => ({
            auth: { ticketNonce: markTicketNonce(response.ticketNonce), authAt: markAuthAt(new Date()) },
            api: {
                apiNonce: markApiNonce(response.api.apiNonce),
                apiRoles: markApiRoles(response.api.apiRoles),
            },
        }),
        error: (err: RemoteAccessError): AuthenticatePasswordRemoteError => {
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
        unknown: (err: unknown): AuthenticatePasswordRemoteError => ({
            type: "infra-error",
            err: `${err}`,
        }),
    })
}
