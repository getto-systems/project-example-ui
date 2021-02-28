import { WorkerProxySpec } from "../../../../../../../../../z_vendor/getto-application/action/worker/message"

import { CheckSendingStatusEvent } from "../../../../event"

import { ConvertLocationResult } from "../../../../../../../../../z_vendor/getto-application/location/data"
import { ResetSessionID } from "../../../../../kernel/data"

export type CheckPasswordResetSendingStatusProxyMaterial = Readonly<{
    checkStatus: CheckStatus["method"]
}>
export type CheckPasswordResetSendingStatusProxyMessage = CheckStatus["message"]
export type CheckPasswordResetSendingStatusProxyResponse = CheckStatus["response"]

type CheckStatus = WorkerProxySpec<
    "checkStatus",
    Readonly<{ sessionID: ConvertLocationResult<ResetSessionID> }>,
    CheckSendingStatusEvent
>
