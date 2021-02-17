import { initConnectRemoteAccess } from "../../../../../../../z_infra/remote/connect"

import { RawRemote, RemoteError } from "../../../../../../../z_infra/remote/infra"
import { LoadOutlineMenuBadgeRemoteAccess, OutlineMenuBadge } from "../../../infra"

import { ApiNonce } from "../../../../../../../common/apiCredential/data"
import { LoadOutlineMenuBadgeRemoteError } from "../../../data"

type Raw = RawRemote<ApiNonce, OutlineMenuBadge>

export function initLoadOutlineMenuBadgeConnectRemoteAccess(access: Raw): LoadOutlineMenuBadgeRemoteAccess {
    return initConnectRemoteAccess(access, {
        message: (nonce: ApiNonce): ApiNonce => nonce,
        value: (response: OutlineMenuBadge): OutlineMenuBadge => response,
        error: (err: RemoteError): LoadOutlineMenuBadgeRemoteError => {
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
        unknown: (err: unknown): LoadOutlineMenuBadgeRemoteError => ({ type: "infra-error", err: `${err}` }),
    })
}
