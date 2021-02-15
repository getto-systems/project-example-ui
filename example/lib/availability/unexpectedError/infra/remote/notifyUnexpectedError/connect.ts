import { NotifyUnexpectedErrorRemoteAccess } from "../../../infra"

import { RawRemoteAccess, RemoteAccessError } from "../../../../../z_infra/remote/infra"
import { initConnectRemoteAccess } from "../../../../../z_infra/remote/connect"

type NotifyRawRemoteAccess = RawRemoteAccess<unknown, true>

export function initNotifyUnexpectedErrorConnectRemoteAccess(
    access: NotifyRawRemoteAccess
): NotifyUnexpectedErrorRemoteAccess {
    return initConnectRemoteAccess(access, {
        message: (err: unknown): unknown => err,
        value: (response: true): true => response,
        error: (err: RemoteAccessError): RemoteAccessError => err,
        unknown: (err: unknown): RemoteAccessError => ({ type: "infra-error", detail: `${err}` }),
    })
}
