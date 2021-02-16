import { initConnectRemoteAccess } from "../../../../../../../z_infra/remote/connect"

import {
    RawRemoteAccess,
    RemoteAccessError,
} from "../../../../../../../z_infra/remote/infra"
import { RenewAuthnInfoRemoteAccess, RenewAuthnInfoRemoteResponse } from "../../../infra"

import {
    markAuthAt,
    markAuthnNonce,
    RenewAuthnInfoRemoteError,
    AuthnNonce,
} from "../../../data"
import {
    markApiNonce,
    markApiRoles,
} from "../../../../../../../common/apiCredential/data"

type Raw = RawRemoteAccess<AuthnNonce, RawAuthnInfo>
type RawAuthnInfo = Readonly<{
    authnNonce: string
    api: Readonly<{ apiNonce: string; apiRoles: string[] }>
}>

export function initRenewAuthnInfoConnectRemoteAccess(
    access: Raw
): RenewAuthnInfoRemoteAccess {
    return initConnectRemoteAccess(access, {
        message: (nonce: AuthnNonce): AuthnNonce => nonce,
        value: (response: RawAuthnInfo): RenewAuthnInfoRemoteResponse => {
            return {
                auth: {
                    authnNonce: markAuthnNonce(response.authnNonce),
                    authAt: markAuthAt(new Date()),
                },
                api: {
                    apiNonce: markApiNonce(response.api.apiNonce),
                    apiRoles: markApiRoles(response.api.apiRoles),
                },
            }
        },
        error: (err: RemoteAccessError): RenewAuthnInfoRemoteError => {
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
        unknown: (err: unknown): RenewAuthnInfoRemoteError => ({
            type: "infra-error",
            err: `${err}`,
        }),
    })
}
