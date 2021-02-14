import { initConnectRemoteAccess } from "../../../../../../../../z_infra/remote/connect"

import { RawRemoteAccess, RemoteAccessError } from "../../../../../../../../z_infra/remote/infra"
import { SendTokenRemoteAccess } from "../../../infra"

import { CheckStatusRemoteError } from "../../../data"

type SendTokenRawRemoteAccess = RawRemoteAccess<null, true>

export function initSendTokenConnectRemoteAccess(
    access: SendTokenRawRemoteAccess
): SendTokenRemoteAccess {
    return initConnectRemoteAccess(access, {
        message: (_message: null): null => null,
        value: (response: true): true => response,
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
