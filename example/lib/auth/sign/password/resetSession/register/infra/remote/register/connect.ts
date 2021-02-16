import {
    markApiNonce,
    markApiRoles,
} from "../../../../../../../../common/apiCredential/data"
import { initConnectRemoteAccess } from "../../../../../../../../z_infra/remote/connect"
import {
    RawRemoteAccess,
    RemoteAccessError,
} from "../../../../../../../../z_infra/remote/infra"
import { markAuthAt, markAuthnNonce } from "../../../../../../authnInfo/common/data"
import { RegisterPasswordResetSessionRemoteError } from "../../../data"
import {
    RegisterPasswordResetSessionRemoteAccess,
    RegisterPasswordResetSessionRemoteMessage,
    RegisterPasswordResetSessionRemoteResponse,
} from "../../../infra"

type Raw = RawRemoteAccess<RegisterPasswordResetSessionRemoteMessage, RawAuthnInfo>
type RawAuthnInfo = Readonly<{
    authnNonce: string
    api: Readonly<{ apiNonce: string; apiRoles: string[] }>
}>

export function initRegisterPasswordResetSessionConnectRemoteAccess(
    access: Raw
): RegisterPasswordResetSessionRemoteAccess {
    return initConnectRemoteAccess(access, {
        message: (
            message: RegisterPasswordResetSessionRemoteMessage
        ): RegisterPasswordResetSessionRemoteMessage => message,
        value: (response: RawAuthnInfo): RegisterPasswordResetSessionRemoteResponse => {
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
        error: (err: RemoteAccessError): RegisterPasswordResetSessionRemoteError => {
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
        unknown: (err: unknown): RegisterPasswordResetSessionRemoteError => ({
            type: "infra-error",
            err: `${err}`,
        }),
    })
}
