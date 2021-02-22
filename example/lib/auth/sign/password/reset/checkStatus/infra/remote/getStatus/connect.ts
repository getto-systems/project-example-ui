import { initConnectRemoteAccess } from "../../../../../../../../z_getto/remote/connect"
import { RawRemote, RemoteError } from "../../../../../../../../z_getto/remote/infra"
import { PasswordResetSessionID } from "../../../../kernel/data"

import { CheckPasswordResetSendingStatusRemoteError } from "../../../data"
import {
    GetPasswordResetSendingStatusRemote,
    GetPasswordResetSendingStatusResponse,
} from "../../../infra"

type Raw = RawRemote<PasswordResetSessionID, RawSessionStatus>
type RawSessionStatus =
    | Readonly<{ done: false; status: SendingStatus }>
    | Readonly<{ done: true; send: false; err: string }>
    | Readonly<{ done: true; send: true }>

type SendingStatus = Readonly<{ sending: boolean }>

export function initGetPasswordResetSendingStatusConnect(
    access: Raw,
): GetPasswordResetSendingStatusRemote {
    return initConnectRemoteAccess(access, {
        message: (sessionID: PasswordResetSessionID): PasswordResetSessionID => sessionID,
        value: (response: RawSessionStatus): GetPasswordResetSendingStatusResponse => response,
        error: (err: RemoteError): CheckPasswordResetSendingStatusRemoteError => {
            switch (err.type) {
                case "invalid-password-reset":
                case "bad-request":
                case "server-error":
                    return { type: err.type }

                case "bad-response":
                    return { type: "bad-response", err: err.detail }

                default:
                    return { type: "infra-error", err: err.detail }
            }
        },
        unknown: (err: unknown): CheckPasswordResetSendingStatusRemoteError => ({
            type: "infra-error",
            err: `${err}`,
        }),
    })
}
