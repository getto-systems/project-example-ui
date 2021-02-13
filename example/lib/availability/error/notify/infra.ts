import { RemoteAccess, RemoteAccessError, RemoteAccessResult } from "../../../z_infra/remote/infra"
import { RemoteAccessSimulator } from "../../../z_infra/remote/simulate"

export type NotifyInfra = Readonly<{
    notify: NotifyRemoteAccess
}>

export type NotifyRemoteAccess = RemoteAccess<unknown, true, NotifyRemoteError>
export type NotifyRemoteAccessResult = RemoteAccessResult<true, NotifyRemoteError>
export type NotifySimulator = RemoteAccessSimulator<unknown, true, NotifyRemoteError>

export type NotifyRemoteError = RemoteAccessError
