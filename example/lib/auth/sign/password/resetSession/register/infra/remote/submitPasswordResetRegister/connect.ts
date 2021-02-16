import { markApiNonce, markApiRoles } from "../../../../../../../../common/apiCredential/data"
import { initConnectRemoteAccess } from "../../../../../../../../z_infra/remote/connect"
import { RawRemoteAccess, RemoteAccessError } from "../../../../../../../../z_infra/remote/infra"
import { markAuthAt, markTicketNonce } from "../../../../../../authCredential/common/data"
import { SubmitPasswordResetRegisterRemoteError } from "../../../data"
import {
    SubmitPasswordResetRegisterRemoteAccess,
    SubmitPasswordResetRegisterRemoteMessage,
    SubmitPasswordResetRegisterRemoteResponse,
} from "../../../infra"

type Raw = RawRemoteAccess<SubmitPasswordResetRegisterRemoteMessage, RawAuthCredential>
type RawAuthCredential = Readonly<{
    ticketNonce: string
    api: Readonly<{ apiNonce: string; apiRoles: string[] }>
}>

export function initSubmitPasswordResetRegisterConnectRemoteAccess(
    access: Raw
): SubmitPasswordResetRegisterRemoteAccess {
    return initConnectRemoteAccess(access, {
        message: (
            message: SubmitPasswordResetRegisterRemoteMessage
        ): SubmitPasswordResetRegisterRemoteMessage => message,
        value: (response: RawAuthCredential): SubmitPasswordResetRegisterRemoteResponse => {
            return {
                auth: {
                    ticketNonce: markTicketNonce(response.ticketNonce),
                    authAt: markAuthAt(new Date()),
                },
                api: {
                    apiNonce: markApiNonce(response.api.apiNonce),
                    apiRoles: markApiRoles(response.api.apiRoles),
                },
            }
        },
        error: (err: RemoteAccessError): SubmitPasswordResetRegisterRemoteError => {
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
        unknown: (err: unknown): SubmitPasswordResetRegisterRemoteError => ({
            type: "infra-error",
            err: `${err}`,
        }),
    })
}
