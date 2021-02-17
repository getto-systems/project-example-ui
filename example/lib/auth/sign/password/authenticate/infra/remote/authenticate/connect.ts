import { initConnectRemoteAccess } from "../../../../../../../z_infra/remote/connect"

import {
    AuthenticatePasswordRemote,
    AuthenticatePasswordResponse,
} from "../../../infra"

import {
    AuthenticatePasswordFields,
    AuthenticatePasswordRemoteError,
} from "../../../data"
import { RawRemote, RemoteError } from "../../../../../../../z_infra/remote/infra"
import { markAuthAt, markAuthnNonce } from "../../../../../kernel/authnInfo/kernel/data"
import {
    markApiNonce,
    markApiRoles,
} from "../../../../../../../common/apiCredential/data"

type Raw = RawRemote<AuthenticatePasswordFields, RawAuthnInfo>
type RawAuthnInfo = Readonly<{
    authnNonce: string
    api: Readonly<{ apiNonce: string; apiRoles: string[] }>
}>

export function initAuthenticatePasswordConnect(
    access: Raw
): AuthenticatePasswordRemote {
    return initConnectRemoteAccess(access, {
        message: (fields: AuthenticatePasswordFields): AuthenticatePasswordFields =>
            fields,
        value: (response: RawAuthnInfo): AuthenticatePasswordResponse => ({
            auth: {
                authnNonce: markAuthnNonce(response.authnNonce),
                authAt: markAuthAt(new Date()),
            },
            api: {
                apiNonce: markApiNonce(response.api.apiNonce),
                apiRoles: markApiRoles(response.api.apiRoles),
            },
        }),
        error: (err: RemoteError): AuthenticatePasswordRemoteError => {
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
