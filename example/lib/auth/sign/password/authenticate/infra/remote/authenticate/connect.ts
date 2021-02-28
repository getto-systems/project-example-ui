import { initConnectRemoteAccess } from "../../../../../../../z_vendor/getto-application/infra/remote/connect"

import {
    AuthenticateRemote,
    AuthenticateResponse,
} from "../../../infra"

import {
    AuthenticateFields,
    AuthenticateRemoteError,
} from "../../../data"
import { RawRemote, RemoteError } from "../../../../../../../z_vendor/getto-application/infra/remote/infra"
import { markAuthAt, markAuthnNonce } from "../../../../../kernel/authnInfo/kernel/data"
import {
    markApiNonce_legacy,
    markApiRoles_legacy,
} from "../../../../../../../common/authz/data"

type Raw = RawRemote<AuthenticateFields, RawAuthnInfo>
type RawAuthnInfo = Readonly<{
    authnNonce: string
    api: Readonly<{ apiNonce: string; apiRoles: string[] }>
}>

export function initAuthenticateConnect(
    access: Raw
): AuthenticateRemote {
    return initConnectRemoteAccess(access, {
        message: (fields: AuthenticateFields): AuthenticateFields =>
            fields,
        value: (response: RawAuthnInfo): AuthenticateResponse => ({
            auth: {
                authnNonce: markAuthnNonce(response.authnNonce),
                authAt: markAuthAt(new Date()),
            },
            api: {
                nonce: markApiNonce_legacy(response.api.apiNonce),
                roles: markApiRoles_legacy(response.api.apiRoles),
            },
        }),
        error: (err: RemoteError): AuthenticateRemoteError => {
            switch (err.type) {
                case "bad-request":
                case "invalid-password-login":
                case "server-error":
                    return { type: err.type }

                case "bad-response":
                    return { type: "bad-response", err: err.err }

                default:
                    return { type: "infra-error", err: err.err }
            }
        },
        unknown: (err: unknown): AuthenticateRemoteError => ({
            type: "infra-error",
            err: `${err}`,
        }),
    })
}
