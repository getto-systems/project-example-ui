import { initConnectRemoteAccess } from "../../../../../../z_infra/remote/connect"

import { RawRemoteAccess, RemoteAccessError } from "../../../../../../z_infra/remote/infra"
import { LoadMenuBadgeRemoteAccess, MenuBadge } from "../../../infra"

import { ApiNonce } from "../../../../../../common/apiCredential/data"
import { LoadMenuBadgeRemoteError } from "../../../data"

type LoadMenuBadgeRawRemoteAccess = RawRemoteAccess<ApiNonce, MenuBadge>

export function initLoadMenuBadgeConnectRemoteAccess(
    access: LoadMenuBadgeRawRemoteAccess
): LoadMenuBadgeRemoteAccess {
    return initConnectRemoteAccess(access, {
        message: (nonce: ApiNonce): ApiNonce => nonce,
        value: (response: MenuBadge): MenuBadge => response,
        error: (err: RemoteAccessError): LoadMenuBadgeRemoteError => {
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
        unknown: (err: unknown): LoadMenuBadgeRemoteError => ({ type: "infra-error", err: `${err}` }),
    })
}
