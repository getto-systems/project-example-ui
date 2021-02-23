import { markApiNonce, markApiRoles } from "../../../../../../../../common/apiCredential/data"
import { initConnectRemoteAccess } from "../../../../../../../../z_getto/remote/connect"
import { RawRemote, RemoteError } from "../../../../../../../../z_getto/remote/infra"
import { markAuthAt, markAuthnNonce } from "../../../../../../kernel/authnInfo/kernel/data"
import { ResetRemoteError } from "../../../data"
import { ResetRemote, ResetMessage, ResetResponse } from "../../../infra"

type Raw = RawRemote<ResetMessage, RawAuthnInfo>
type RawAuthnInfo = Readonly<{
    authnNonce: string
    api: Readonly<{ apiNonce: string; apiRoles: string[] }>
}>

export function initResetConnect(access: Raw): ResetRemote {
    return initConnectRemoteAccess(access, {
        message: (message: ResetMessage): ResetMessage => message,
        value: (response: RawAuthnInfo): ResetResponse => {
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
        error: (err: RemoteError): ResetRemoteError => {
            switch (err.type) {
                case "bad-request":
                case "server-error":
                    return { type: err.type }

                case "bad-response":
                    return { type: "bad-response", err: err.detail }

                default:
                    return { type: "infra-error", err: err.detail }
            }
        },
        unknown: (err: unknown): ResetRemoteError => ({
            type: "infra-error",
            err: `${err}`,
        }),
    })
}
