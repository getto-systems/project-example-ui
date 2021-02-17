import {
    markApiNonce,
    markApiRoles,
} from "../../../../../../../../common/apiCredential/data"
import { initConnectRemoteAccess } from "../../../../../../../../z_infra/remote/connect"
import { RawRemote, RemoteError } from "../../../../../../../../z_infra/remote/infra"
import { markAuthAt, markAuthnNonce } from "../../../../../../kernel/authnInfo/common/data"
import { RegisterPasswordRemoteError } from "../../../data"
import {
    RegisterPasswordRemote,
    RegisterPasswordMessage,
    RegisterPasswordResponse,
} from "../../../infra"

type Raw = RawRemote<RegisterPasswordMessage, RawAuthnInfo>
type RawAuthnInfo = Readonly<{
    authnNonce: string
    api: Readonly<{ apiNonce: string; apiRoles: string[] }>
}>

export function initRegisterPasswordConnect(access: Raw): RegisterPasswordRemote {
    return initConnectRemoteAccess(access, {
        message: (message: RegisterPasswordMessage): RegisterPasswordMessage => message,
        value: (response: RawAuthnInfo): RegisterPasswordResponse => {
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
        error: (err: RemoteError): RegisterPasswordRemoteError => {
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
        unknown: (err: unknown): RegisterPasswordRemoteError => ({
            type: "infra-error",
            err: `${err}`,
        }),
    })
}
