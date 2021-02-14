import { markApiNonce, markApiRoles } from "../../../../../../../../common/apiCredential/data"
import { initConnectRemoteAccess } from "../../../../../../../../z_infra/remote/connect"
import { RawRemoteAccess, RemoteAccessError } from "../../../../../../../../z_infra/remote/infra"
import { markAuthAt, markTicketNonce } from "../../../../../../authCredential/common/data"
import { SubmitRemoteError } from "../../../data"
import { RegisterRemoteAccess, RegisterRemoteMessage, RegisterRemoteResponse } from "../../../infra"

type RegisterRawRemoteAccess = RawRemoteAccess<RegisterRemoteMessage, RawAuthCredential>
type RawAuthCredential = Readonly<{
    ticketNonce: string
    api: Readonly<{ apiNonce: string; apiRoles: string[] }>
}>

export function initRegisterConnectRemoteAccess(access: RegisterRawRemoteAccess): RegisterRemoteAccess {
    return initConnectRemoteAccess(access, {
        message: (message: RegisterRemoteMessage): RegisterRemoteMessage => message,
        value: (response: RawAuthCredential): RegisterRemoteResponse => {
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
        error: (err: RemoteAccessError): SubmitRemoteError => {
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
        unknown: (err: unknown): SubmitRemoteError => ({ type: "infra-error", err: `${err}` }),
    })
}
