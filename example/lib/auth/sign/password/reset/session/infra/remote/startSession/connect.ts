import { initConnectRemoteAccess } from "../../../../../../../../z_infra/remote/connect"

import { RawRemoteAccess, RemoteAccessError } from "../../../../../../../../z_infra/remote/infra"
import { StartSessionRemoteAccess } from "../../../infra"

import { markSessionID, SessionID, StartSessionFields, StartSessionRemoteError } from "../../../data"

type StartSessionRawRemoteAccess = RawRemoteAccess<StartSessionFields, RawSessionID>
type RawSessionID = string

export function initStartSessionConnectRemoteAccess(
    access: StartSessionRawRemoteAccess
): StartSessionRemoteAccess {
    return initConnectRemoteAccess(access, {
        message: (fields: StartSessionFields): StartSessionFields => fields,
        value: (response: RawSessionID): SessionID => markSessionID(response),
        error: (err: RemoteAccessError): StartSessionRemoteError => {
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
        unknown: (err: unknown): StartSessionRemoteError => ({ type: "infra-error", err: `${err}` }),
    })
}
