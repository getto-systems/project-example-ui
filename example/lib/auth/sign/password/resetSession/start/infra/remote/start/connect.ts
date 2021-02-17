import { initConnectRemoteAccess } from "../../../../../../../../z_infra/remote/connect"

import { RawRemote, RemoteError } from "../../../../../../../../z_infra/remote/infra"
import { StartPasswordResetSessionSessionRemote } from "../../../infra"

import {
    markPasswordResetSessionID,
    PasswordResetSessionID,
    PasswordResetSessionFields,
    StartPasswordResetSessionRemoteError,
} from "../../../data"

type Raw = RawRemote<PasswordResetSessionFields, RawSessionID>
type RawSessionID = string

export function initStartPasswordResetSessionConnect(
    access: Raw
): StartPasswordResetSessionSessionRemote {
    return initConnectRemoteAccess(access, {
        message: (fields: PasswordResetSessionFields): PasswordResetSessionFields =>
            fields,
        value: (response: RawSessionID): PasswordResetSessionID =>
            markPasswordResetSessionID(response),
        error: (err: RemoteError): StartPasswordResetSessionRemoteError => {
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
        unknown: (err: unknown): StartPasswordResetSessionRemoteError => ({
            type: "infra-error",
            err: `${err}`,
        }),
    })
}
