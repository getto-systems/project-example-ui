import { Delayed } from "../../../../../z_getto/infra/delayed/infra"
import { Remote, RemoteResult, RemoteSimulator } from "../../../../../z_getto/remote/infra"
import { DelayTime } from "../../../../../z_getto/infra/config/infra"

import { RequestTokenFields, RequestTokenRemoteError } from "./data"
import { PasswordResetSessionID } from "../kernel/data"

export type RequestTokenInfra = Readonly<{
    request: RequestTokenRemote
    delayed: Delayed
    config: Readonly<{
        delay: DelayTime
    }>
}>

export type RequestTokenRemote = Remote<
    RequestTokenFields,
    PasswordResetSessionID,
    RequestTokenRemoteError
>
export type RequestTokenResult = RemoteResult<PasswordResetSessionID, RequestTokenRemoteError>
export type RequestTokenSimulator = RemoteSimulator<
    RequestTokenFields,
    PasswordResetSessionID,
    RequestTokenRemoteError
>
