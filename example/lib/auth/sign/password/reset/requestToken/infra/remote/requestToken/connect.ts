import { initConnectRemoteAccess } from "../../../../../../../../z_getto/remote/connect"

import { RawRemote, RemoteError } from "../../../../../../../../z_getto/remote/infra"
import { RequestPasswordResetTokenRemote } from "../../../infra"

import { PasswordResetRequestFields, RequestPasswordResetTokenRemoteError } from "../../../data"
import { markPasswordResetSessionID, PasswordResetSessionID } from "../../../../kernel/data"

type Raw = RawRemote<PasswordResetRequestFields, RawSessionID>
type RawSessionID = string

export function initRequestPasswordResetTokenConnect(access: Raw): RequestPasswordResetTokenRemote {
    return initConnectRemoteAccess(access, {
        message: (fields: PasswordResetRequestFields): PasswordResetRequestFields => fields,
        value: (response: RawSessionID): PasswordResetSessionID =>
            markPasswordResetSessionID(response),
        error: (err: RemoteError): RequestPasswordResetTokenRemoteError => {
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
        unknown: (err: unknown): RequestPasswordResetTokenRemoteError => ({
            type: "infra-error",
            err: `${err}`,
        }),
    })
}
