import { initConnectRemoteAccess } from "../../../../../../../../z_vendor/getto-application/infra/remote/connect"

import { RawRemote, RemoteError } from "../../../../../../../../z_vendor/getto-application/infra/remote/infra"
import { RenewRemote, RenewResponse } from "../../../infra"

import { markAuthAt, markAuthnNonce, RenewRemoteError, AuthnNonce } from "../../../data"
import { markApiNonce, markApiRoles } from "../../../../../../../../common/apiCredential/data"

type Raw = RawRemote<AuthnNonce, RawAuthnInfo>
type RawAuthnInfo = Readonly<{
    authnNonce: string
    api: Readonly<{ apiNonce: string; apiRoles: string[] }>
}>

export function initRenewConnect(access: Raw): RenewRemote {
    return initConnectRemoteAccess(access, {
        message: (nonce: AuthnNonce): AuthnNonce => nonce,
        value: (response: RawAuthnInfo): RenewResponse => {
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
        error: (err: RemoteError): RenewRemoteError => {
            switch (err.type) {
                case "invalid-ticket":
                case "bad-request":
                case "server-error":
                    return { type: err.type }

                case "bad-response":
                    return { type: "bad-response", err: err.err }

                default:
                    return { type: "infra-error", err: err.err }
            }
        },
        unknown: (err: unknown): RenewRemoteError => ({
            type: "infra-error",
            err: `${err}`,
        }),
    })
}
