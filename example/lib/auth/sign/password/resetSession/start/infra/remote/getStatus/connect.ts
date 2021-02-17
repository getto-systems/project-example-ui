import { initConnectRemoteAccess } from "../../../../../../../../z_infra/remote/connect"
import { RawRemote, RemoteError } from "../../../../../../../../z_infra/remote/infra"

import {
    CheckPasswordResetSessionStatusRemoteError,
    PasswordResetSessionID,
} from "../../../data"
import {
    GetPasswordResetSessionStatusRemote,
    GetPasswordResetSessionStatusResponse,
} from "../../../infra"

type Raw = RawRemote<PasswordResetSessionID, RawSessionStatus>
type RawSessionStatus =
    | Readonly<{ dest: RawDestination; done: false; status: SendingStatus }>
    | Readonly<{ dest: RawDestination; done: true; send: false; err: string }>
    | Readonly<{ dest: RawDestination; done: true; send: true }>

type RawDestination = Readonly<{ type: "log" }>
type SendingStatus = Readonly<{ sending: boolean }>

export function initGetPasswordResetSessionStatusConnect(
    access: Raw
): GetPasswordResetSessionStatusRemote {
    return initConnectRemoteAccess(access, {
        message: (sessionID: PasswordResetSessionID): PasswordResetSessionID => sessionID,
        value: (response: RawSessionStatus): GetPasswordResetSessionStatusResponse => {
            // TODO ちゃんと mark する
            return response
        },
        error: (err: RemoteError): CheckPasswordResetSessionStatusRemoteError => {
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
        unknown: (err: unknown): CheckPasswordResetSessionStatusRemoteError => ({
            type: "infra-error",
            err: `${err}`,
        }),
    })
}
