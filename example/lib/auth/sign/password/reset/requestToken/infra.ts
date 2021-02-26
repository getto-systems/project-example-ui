import { DelayedChecker } from "../../../../../z_vendor/getto-application/infra/timer/infra"
import { Remote, RemoteResult, RemoteSimulator } from "../../../../../z_vendor/getto-application/remote/infra"
import { DelayTime } from "../../../../../z_vendor/getto-application/infra/config/infra"

import { RequestTokenFields, RequestTokenRemoteError } from "./data"
import { ResetSessionID } from "../kernel/data"

export type RequestTokenInfra = Readonly<{
    request: RequestTokenRemote
    delayed: DelayedChecker
    config: Readonly<{
        delay: DelayTime
    }>
}>

export type RequestTokenRemote = Remote<
    RequestTokenFields,
    ResetSessionID,
    RequestTokenRemoteError
>
export type RequestTokenResult = RemoteResult<ResetSessionID, RequestTokenRemoteError>
export type RequestTokenSimulator = RemoteSimulator<
    RequestTokenFields,
    ResetSessionID,
    RequestTokenRemoteError
>
