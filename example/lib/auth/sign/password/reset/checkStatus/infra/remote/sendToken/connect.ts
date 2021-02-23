import { initConnectRemoteAccess } from "../../../../../../../../z_getto/remote/connect"

import { RawRemote, RemoteError } from "../../../../../../../../z_getto/remote/infra"
import { SendTokenRemote } from "../../../infra"

import { CheckSendingStatusRemoteError } from "../../../data"

type Raw = RawRemote<null, true>

export function initSendTokenConnect(access: Raw): SendTokenRemote {
    return initConnectRemoteAccess(access, {
        message: (message: null): null => message,
        value: (response: true): true => response,
        error: (err: RemoteError): CheckSendingStatusRemoteError => {
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
        unknown: (err: unknown): CheckSendingStatusRemoteError => ({
            type: "infra-error",
            err: `${err}`,
        }),
    })
}
