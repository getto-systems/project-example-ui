import { initConnectRemoteAccess } from "../../../../../../../../z_infra/remote/connect"
import { RawRemoteAccess, RemoteAccessError } from "../../../../../../../../z_infra/remote/infra"

import { CheckStatusRemoteError, SessionID } from "../../../data"
import { GetStatusRemoteAccess, GetStatusResponse } from "../../../infra"

type GetStatusRawRemoteAccess = RawRemoteAccess<SessionID, RawSessionStatus>
type RawSessionStatus =
    | Readonly<{ dest: RawDestination; done: false; status: SendingStatus }>
    | Readonly<{ dest: RawDestination; done: true; send: false; err: string }>
    | Readonly<{ dest: RawDestination; done: true; send: true }>

type RawDestination = Readonly<{ type: "log" }>
type SendingStatus = Readonly<{ sending: boolean }>

export function initGetStatusConnectRemoteAccess(
    access: GetStatusRawRemoteAccess
): GetStatusRemoteAccess {
    return initConnectRemoteAccess(access, {
        message: (sessionID: SessionID): SessionID => sessionID,
        value: (response: RawSessionStatus): GetStatusResponse => {
            // TODO ちゃんと mark する
            return response
        },
        error: (err: RemoteAccessError): CheckStatusRemoteError => {
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
        unknown: (err: unknown): CheckStatusRemoteError => ({ type: "infra-error", err: `${err}` }),
    })
}
