import { initConnectRemoteAccess } from "../../../../../../../../z_vendor/getto-application/remote/connect"

import { RawRemote, RemoteError } from "../../../../../../../../z_vendor/getto-application/remote/infra"
import { RequestTokenRemote } from "../../../infra"

import { RequestTokenFields, RequestTokenRemoteError } from "../../../data"
import { markResetSessionID, ResetSessionID } from "../../../../kernel/data"

type Raw = RawRemote<RequestTokenFields, RawSessionID>
type RawSessionID = string

export function initRequestTokenConnect(access: Raw): RequestTokenRemote {
    return initConnectRemoteAccess(access, {
        message: (fields: RequestTokenFields): RequestTokenFields => fields,
        value: (response: RawSessionID): ResetSessionID =>
            markResetSessionID(response),
        error: (err: RemoteError): RequestTokenRemoteError => {
            switch (err.type) {
                case "bad-request":
                case "server-error":
                    return { type: err.type }

                case "bad-response":
                    return { type: "bad-response", err: err.err }

                default:
                    return { type: "infra-error", err: err.err }
            }
        },
        unknown: (err: unknown): RequestTokenRemoteError => ({
            type: "infra-error",
            err: `${err}`,
        }),
    })
}
