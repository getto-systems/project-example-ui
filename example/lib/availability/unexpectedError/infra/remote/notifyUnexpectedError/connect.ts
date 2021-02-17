import { NotifyUnexpectedErrorRemoteAccess } from "../../../infra"

import { RawRemote, RemoteError } from "../../../../../z_infra/remote/infra"
import { initConnectRemoteAccess } from "../../../../../z_infra/remote/connect"

type NotifyRawRemoteAccess = RawRemote<unknown, true>

export function initNotifyUnexpectedErrorConnectRemoteAccess(
    access: NotifyRawRemoteAccess
): NotifyUnexpectedErrorRemoteAccess {
    return initConnectRemoteAccess(access, {
        message: (err: unknown): unknown => err,
        value: (response: true): true => response,
        error: (err: RemoteError): RemoteError => err,
        unknown: (err: unknown): RemoteError => ({ type: "infra-error", detail: `${err}` }),
    })
}
