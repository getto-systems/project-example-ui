import { markApiNonce_legacy, markApiRoles_legacy } from "../../../../../../../../common/authz/data"
import { initConnectRemoteAccess } from "../../../../../../../../z_vendor/getto-application/infra/remote/connect"
import {
    RawRemote,
    RemoteError,
} from "../../../../../../../../z_vendor/getto-application/infra/remote/infra"
import {
    AuthInfo,
    markAuthAt_legacy,
    markAuthnNonce_legacy,
} from "../../../../../../kernel/authn/kernel/data"
import { ResetRemoteError } from "../../../data"
import { ResetRemote, ResetMessage } from "../../../infra"

type Raw = RawRemote<ResetMessage, RawAuthnInfo>
type RawAuthnInfo = Readonly<{
    authn: Readonly<{ nonce: string }>
    authz: Readonly<{ nonce: string; roles: string[] }>
}>

export function initResetConnect(access: Raw): ResetRemote {
    return initConnectRemoteAccess(access, {
        message: (message: ResetMessage): ResetMessage => message,
        value: (response: RawAuthnInfo): AuthInfo => {
            return {
                authn: {
                    nonce: markAuthnNonce_legacy(response.authn.nonce),
                    authAt: markAuthAt_legacy(new Date()),
                },
                authz: {
                    nonce: markApiNonce_legacy(response.authz.nonce),
                    roles: markApiRoles_legacy(response.authz.roles),
                },
            }
        },
        error: (err: RemoteError): ResetRemoteError => {
            switch (err.type) {
                case "bad-request":
                case "server-error":
                    return { type: err.type }

                case "bad-response":
                    return { type: "bad-response", err: err.err }

                default:
                    return { type: "infra-error", err: err.err }
            }
        },
        unknown: (err: unknown): ResetRemoteError => ({
            type: "infra-error",
            err: `${err}`,
        }),
    })
}
