import { initConnectRemoteAccess } from "../../../../../../../../z_vendor/getto-application/remote/connect"
import { RawRemote, RemoteError } from "../../../../../../../../z_vendor/getto-application/remote/infra"
import { ResetSessionID } from "../../../../kernel/data"

import { CheckSendingStatusRemoteError } from "../../../data"
import {
    GetSendingStatusRemote,
    GetSendingStatusResponse,
} from "../../../infra"

type Raw = RawRemote<ResetSessionID, RawSessionStatus>
type RawSessionStatus =
    | Readonly<{ done: false; status: SendingStatus }>
    | Readonly<{ done: true; send: false; err: string }>
    | Readonly<{ done: true; send: true }>

type SendingStatus = Readonly<{ sending: boolean }>

export function initGetSendingStatusConnect(
    access: Raw,
): GetSendingStatusRemote {
    return initConnectRemoteAccess(access, {
        message: (sessionID: ResetSessionID): ResetSessionID => sessionID,
        value: (response: RawSessionStatus): GetSendingStatusResponse => response,
        error: (err: RemoteError): CheckSendingStatusRemoteError => {
            switch (err.type) {
                case "invalid-password-reset":
                case "bad-request":
                case "server-error":
                    return { type: err.type }

                case "bad-response":
                    return { type: "bad-response", err: err.err }

                default:
                    return { type: "infra-error", err: err.err }
            }
        },
        unknown: (err: unknown): CheckSendingStatusRemoteError => ({
            type: "infra-error",
            err: `${err}`,
        }),
    })
}
