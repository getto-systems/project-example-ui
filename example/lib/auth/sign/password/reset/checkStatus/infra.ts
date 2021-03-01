import { RemoteTypes_legacy } from "../../../../../z_vendor/getto-application/infra/remote/infra"
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

type SendTokenRemoteTypes = RemoteTypes_legacy<null, true, CheckSendingStatusRemoteError>
export type SendTokenRemote = SendTokenRemoteTypes["remote"]
export type SendTokenResult = SendTokenRemoteTypes["result"]
export type SendTokenSimulator = SendTokenRemoteTypes["simulator"]

type GetSendingStatusRemoteTypes = RemoteTypes_legacy<
    ResetSessionID,
    SendingTokenStatus,
    CheckSendingStatusRemoteError
>
export type GetSendingStatusRemote = GetSendingStatusRemoteTypes["remote"]
export type GetSendingStatusResult = GetSendingStatusRemoteTypes["result"]
export type GetSendingStatusSimulator = GetSendingStatusRemoteTypes["simulator"]
