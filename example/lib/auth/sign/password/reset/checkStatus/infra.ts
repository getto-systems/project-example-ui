import { Wait } from "../../../../../z_getto/infra/delayed/infra"
import { Remote, RemoteResult, RemoteSimulator } from "../../../../../z_getto/remote/infra"
import { Limit, WaitTime } from "../../../../../z_getto/infra/config/infra"

import { CheckPasswordResetSendingStatusRemoteError, PasswordResetSendingStatus } from "./data"
import { ResetSessionID } from "../kernel/data"

export type CheckPasswordResetSendingStatusInfra = Readonly<{
    sendToken: SendPasswordResetTokenRemote
    getStatus: GetPasswordResetSendingStatusRemote
    wait: Wait
    config: Readonly<{
        wait: WaitTime
        limit: Limit
    }>
}>

export type SendPasswordResetTokenRemote = Remote<
    null,
    true,
    CheckPasswordResetSendingStatusRemoteError
>
export type SendPasswordResetTokenResult = RemoteResult<
    true,
    CheckPasswordResetSendingStatusRemoteError
>
export type SendPasswordResetTokenSimulator = RemoteSimulator<
    null,
    true,
    CheckPasswordResetSendingStatusRemoteError
>

export type GetPasswordResetSendingStatusRemote = Remote<
    ResetSessionID,
    GetPasswordResetSendingStatusResponse,
    CheckPasswordResetSendingStatusRemoteError
>
export type GetPasswordResetSendingStatusResult = RemoteResult<
    GetPasswordResetSendingStatusResponse,
    CheckPasswordResetSendingStatusRemoteError
>
export type GetPasswordResetSendingStatusSimulator = RemoteSimulator<
    ResetSessionID,
    GetPasswordResetSendingStatusResponse,
    CheckPasswordResetSendingStatusRemoteError
>

export type GetPasswordResetSendingStatusResponse =
    | Readonly<{ done: false; status: PasswordResetSendingStatus }>
    | Readonly<{ done: true; send: false; err: string }>
    | Readonly<{ done: true; send: true }>
