import { Delayed } from "../../../../../z_getto/infra/delayed/infra"
import { Remote, RemoteResult, RemoteSimulator } from "../../../../../z_getto/remote/infra"
import { DelayTime } from "../../../../../z_getto/infra/config/infra"

import { PasswordResetRequestFields, RequestPasswordResetTokenRemoteError } from "./data"
import { PasswordResetSessionID } from "../kernel/data"

export type RequestPasswordResetTokenInfra = Readonly<{
    request: RequestPasswordResetTokenRemote
    delayed: Delayed
    config: Readonly<{
        delay: DelayTime
    }>
}>

export type RequestPasswordResetTokenRemote = Remote<
    PasswordResetRequestFields,
    PasswordResetSessionID,
    RequestPasswordResetTokenRemoteError
>
export type RequestPasswordResetTokenResult = RemoteResult<
    PasswordResetSessionID,
    RequestPasswordResetTokenRemoteError
>
export type RequestPasswordResetTokenSimulator = RemoteSimulator<
    PasswordResetRequestFields,
    PasswordResetSessionID,
    RequestPasswordResetTokenRemoteError
>
