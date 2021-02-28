import {
    Remote,
    RemoteResult,
    RemoteSimulator,
    RemoteTypes,
} from "../../../../../z_vendor/getto-application/infra/remote/infra"
import { Limit, WaitTime } from "../../../../../z_vendor/getto-application/infra/config/infra"

import { CheckSendingStatusRemoteError, SendingTokenStatus } from "./data"
import { ResetSessionID } from "../kernel/data"

export type CheckSendingStatusInfra = Readonly<{
    sendToken: SendTokenRemote
    getStatus: GetSendingStatusRemote
    config: Readonly<{
        wait: WaitTime
        limit: Limit
    }>
}>

export type SendTokenRemote = Remote<null, true, CheckSendingStatusRemoteError>
export type SendTokenResult = RemoteResult<true, CheckSendingStatusRemoteError>
export type SendTokenSimulator = RemoteSimulator<null, true, CheckSendingStatusRemoteError>

type GetSendingStatusRemoteTypes = RemoteTypes<
    ResetSessionID,
    SendingTokenStatus,
    CheckSendingStatusRemoteError
>
export type GetSendingStatusRemote = GetSendingStatusRemoteTypes["remote"]
export type GetSendingStatusResult = GetSendingStatusRemoteTypes["result"]
export type GetSendingStatusSimulator = GetSendingStatusRemoteTypes["simulator"]
