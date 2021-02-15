import { initConnectRemoteAccess } from "../../../../../../../z_infra/remote/connect"

import { SubmitPasswordLoginRemoteAccess, SubmitPasswordLoginRemoteResponse } from "../../../infra"

import { PasswordLoginFields, SubmitPasswordLoginRemoteError } from "../../../data"
import { RawRemoteAccess, RemoteAccessError } from "../../../../../../../z_infra/remote/infra"
import { markAuthAt, markTicketNonce } from "../../../../../authCredential/common/data"
import { markApiNonce, markApiRoles } from "../../../../../../../common/apiCredential/data"

type Raw = RawRemoteAccess<PasswordLoginFields, RawAuthCredential>
type RawAuthCredential = Readonly<{
    ticketNonce: string
    api: Readonly<{ apiNonce: string; apiRoles: string[] }>
}>

export function initSubmitPasswordLoginConnectRemoteAccess(access: Raw): SubmitPasswordLoginRemoteAccess {
    return initConnectRemoteAccess(access, {
        message: (fields: PasswordLoginFields): PasswordLoginFields => fields,
        value: (response: RawAuthCredential): SubmitPasswordLoginRemoteResponse => ({
            auth: { ticketNonce: markTicketNonce(response.ticketNonce), authAt: markAuthAt(new Date()) },
            api: {
                apiNonce: markApiNonce(response.api.apiNonce),
                apiRoles: markApiRoles(response.api.apiRoles),
            },
        }),
        error: (err: RemoteAccessError): SubmitPasswordLoginRemoteError => {
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
        unknown: (err: unknown): SubmitPasswordLoginRemoteError => ({ type: "infra-error", err: `${err}` }),
    })
}
