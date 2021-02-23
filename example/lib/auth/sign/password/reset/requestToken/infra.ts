import { Delayed } from "../../../../../z_getto/infra/delayed/infra"
import { Remote, RemoteResult, RemoteSimulator } from "../../../../../z_getto/remote/infra"
import { DelayTime } from "../../../../../z_getto/infra/config/infra"

import { RequestTokenFields, RequestTokenRemoteError } from "./data"
import { ResetSessionID } from "../kernel/data"

export type RequestTokenInfra = Readonly<{
    request: RequestTokenRemote
    delayed: Delayed
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
