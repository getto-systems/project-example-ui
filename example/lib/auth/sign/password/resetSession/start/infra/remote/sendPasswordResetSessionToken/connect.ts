import { initConnectRemoteAccess } from "../../../../../../../../z_infra/remote/connect"

import { RawRemoteAccess, RemoteAccessError } from "../../../../../../../../z_infra/remote/infra"
import { SendPasswordResetSessionTokenRemoteAccess } from "../../../infra"

import { CheckPasswordResetSessionStatusRemoteError } from "../../../data"

type Raw = RawRemoteAccess<null, true>

export function initSendPasswordResetSessionTokenConnectRemoteAccess(
    access: Raw
): SendPasswordResetSessionTokenRemoteAccess {
    return initConnectRemoteAccess(access, {
        message: (message: null): null => message,
        value: (response: true): true => response,
        error: (err: RemoteAccessError): CheckPasswordResetSessionStatusRemoteError => {
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
