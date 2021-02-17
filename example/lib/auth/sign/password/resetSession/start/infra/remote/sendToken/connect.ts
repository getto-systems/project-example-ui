import { initConnectRemoteAccess } from "../../../../../../../../z_infra/remote/connect"

import { RawRemote, RemoteError } from "../../../../../../../../z_infra/remote/infra"
import { SendPasswordResetSessionTokenRemote } from "../../../infra"

import { CheckPasswordResetSessionStatusRemoteError } from "../../../data"

type Raw = RawRemote<null, true>

export function initSendPasswordResetSessionTokenConnect(
    access: Raw
): SendPasswordResetSessionTokenRemote {
    return initConnectRemoteAccess(access, {
        message: (message: null): null => message,
        value: (response: true): true => response,
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
