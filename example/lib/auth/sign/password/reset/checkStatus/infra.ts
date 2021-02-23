import { Wait } from "../../../../../z_getto/infra/delayed/infra"
import { Remote, RemoteResult, RemoteSimulator } from "../../../../../z_getto/remote/infra"
import { Limit, WaitTime } from "../../../../../z_getto/infra/config/infra"

import { CheckSendingStatusRemoteError, SendingStatus } from "./data"
import { ResetSessionID } from "../kernel/data"

export type CheckSendingStatusInfra = Readonly<{
    sendToken: SendTokenRemote
    getStatus: GetSendingStatusRemote
    wait: Wait
    config: Readonly<{
        wait: WaitTime
        limit: Limit
    }>
}>

export type SendTokenRemote = Remote<null, true, CheckSendingStatusRemoteError>
export type SendTokenResult = RemoteResult<true, CheckSendingStatusRemoteError>
export type SendTokenSimulator = RemoteSimulator<null, true, CheckSendingStatusRemoteError>

export type GetSendingStatusRemote = Remote<
    ResetSessionID,
    GetSendingStatusResponse,
    CheckSendingStatusRemoteError
>
export type GetSendingStatusResult = RemoteResult<
    GetSendingStatusResponse,
    CheckSendingStatusRemoteError
>
export type GetSendingStatusSimulator = RemoteSimulator<
    ResetSessionID,
    GetSendingStatusResponse,
    CheckSendingStatusRemoteError
>

export type GetSendingStatusResponse =
    | Readonly<{ done: false; status: SendingStatus }>
    | Readonly<{ done: true; send: false; err: string }>
    | Readonly<{ done: true; send: true }>
