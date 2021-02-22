import { markApiNonce, markApiRoles } from "../../../../../../../../common/apiCredential/data"
import { initConnectRemoteAccess } from "../../../../../../../../z_getto/remote/connect"
import { RawRemote, RemoteError } from "../../../../../../../../z_getto/remote/infra"
import { markAuthAt, markAuthnNonce } from "../../../../../../kernel/authnInfo/kernel/data"
import { ResetPasswordRemoteError } from "../../../data"
import { ResetPasswordRemote, ResetPasswordMessage, ResetPasswordResponse } from "../../../infra"

type Raw = RawRemote<ResetPasswordMessage, RawAuthnInfo>
type RawAuthnInfo = Readonly<{
    authnNonce: string
    api: Readonly<{ apiNonce: string; apiRoles: string[] }>
}>

export function initResetPasswordConnect(access: Raw): ResetPasswordRemote {
    return initConnectRemoteAccess(access, {
        message: (message: ResetPasswordMessage): ResetPasswordMessage => message,
        value: (response: RawAuthnInfo): ResetPasswordResponse => {
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
        error: (err: RemoteError): ResetPasswordRemoteError => {
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
        unknown: (err: unknown): ResetPasswordRemoteError => ({
            type: "infra-error",
            err: `${err}`,
        }),
    })
}
