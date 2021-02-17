import { initConnectRemoteAccess } from "../../../../../../../../z_infra/remote/connect"

import { RawRemote, RemoteError } from "../../../../../../../../z_infra/remote/infra"
import { RenewAuthnInfoRemote, RenewAuthnInfoResponse } from "../../../infra"

import {
    markAuthAt,
    markAuthnNonce,
    RenewAuthnInfoRemoteError,
    AuthnNonce,
} from "../../../data"
import {
    markApiNonce,
    markApiRoles,
} from "../../../../../../../../common/apiCredential/data"

type Raw = RawRemote<AuthnNonce, RawAuthnInfo>
type RawAuthnInfo = Readonly<{
    authnNonce: string
    api: Readonly<{ apiNonce: string; apiRoles: string[] }>
}>

export function initRenewAuthnInfoConnect(access: Raw): RenewAuthnInfoRemote {
    return initConnectRemoteAccess(access, {
        message: (nonce: AuthnNonce): AuthnNonce => nonce,
        value: (response: RawAuthnInfo): RenewAuthnInfoResponse => {
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
        error: (err: RemoteError): RenewAuthnInfoRemoteError => {
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
