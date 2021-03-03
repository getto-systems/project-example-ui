import { RemoteTypes } from "../../../../../z_vendor/getto-application/infra/remote/infra"
import { Limit, WaitTime } from "../../../../../z_vendor/getto-application/infra/config/infra"

import { CheckSendingStatusRemoteError, SendingTokenStatus } from "./data"
import { ResetSessionID } from "../kernel/data"

export type CheckSendingStatusInfra = Readonly<{
    sendToken: SendTokenRemotePod
    getStatus: GetSendingStatusRemotePod
    config: Readonly<{
        wait: WaitTime
        limit: Limit
    }>
}>

type SendTokenRemoteTypes = RemoteTypes<null, true, true, CheckSendingStatusRemoteError>
export type SendTokenRemotePod = SendTokenRemoteTypes["pod"]
export type SendTokenResult = SendTokenRemoteTypes["result"]
export type SendTokenSimulator = SendTokenRemoteTypes["simulator"]

type GetSendingStatusRemoteTypes = RemoteTypes<
    ResetSessionID,
    SendingTokenStatus,
    SendingTokenStatus,
    CheckSendingStatusRemoteError
>
export type GetSendingStatusRemotePod = GetSendingStatusRemoteTypes["pod"]
export type GetSendingStatusResult = GetSendingStatusRemoteTypes["result"]
export type GetSendingStatusSimulator = GetSendingStatusRemoteTypes["simulator"]
