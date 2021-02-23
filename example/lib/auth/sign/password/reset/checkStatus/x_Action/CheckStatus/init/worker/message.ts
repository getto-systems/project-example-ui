import { WorkerProxySpec } from "../../../../../../../../../z_getto/application/worker/message"
import { ResetSessionID } from "../../../../../kernel/data"

import { CheckSendingStatusEvent } from "../../../../event"

export type CheckPasswordResetSendingStatusProxyMaterial = Readonly<{
    checkStatus: CheckStatus["method"]
}>
export type CheckPasswordResetSendingStatusProxyMessage = CheckStatus["message"]
export type CheckPasswordResetSendingStatusProxyResponse = CheckStatus["response"]

type CheckStatus = WorkerProxySpec<
    "checkStatus",
    Readonly<{ sessionID: ResetSessionID }>,
    CheckSendingStatusEvent
>
