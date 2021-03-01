import { initConnectRemoteAccess } from "../../../../../../../z_vendor/getto-application/infra/remote/connect"

import { AuthenticateRemote, AuthenticateResponse } from "../../../infra"

import { AuthenticateFields, AuthenticateRemoteError } from "../../../data"
import {
    RawRemote,
    RemoteError,
} from "../../../../../../../z_vendor/getto-application/infra/remote/infra"
import { markAuthAt_legacy, markAuthnNonce_legacy } from "../../../../../kernel/authn/kernel/data"
import { markApiNonce_legacy, markApiRoles_legacy } from "../../../../../../../common/authz/data"

type Raw = RawRemote<AuthenticateFields, RawAuthnInfo>
type RawAuthnInfo = Readonly<{
    authn: Readonly<{ nonce: string }>
    authz: Readonly<{ nonce: string; roles: string[] }>
}>

export function initAuthenticateConnect(access: Raw): AuthenticateRemote {
    return initConnectRemoteAccess(access, {
        message: (fields: AuthenticateFields): AuthenticateFields => fields,
        value: (response: RawAuthnInfo): AuthenticateResponse => ({
            auth: {
                nonce: markAuthnNonce_legacy(response.authn.nonce),
                authAt: markAuthAt_legacy(new Date()),
            },
            api: {
                nonce: markApiNonce_legacy(response.authz.nonce),
                roles: markApiRoles_legacy(response.authz.roles),
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
