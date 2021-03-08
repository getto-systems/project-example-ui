import { WorkerProxySpec } from "../../../../../../../z_vendor/getto-application/action/worker/message"

import { CheckResetTokenSendingStatusEvent } from "../../../check_status/event"

import { ConvertLocationResult } from "../../../../../../../z_vendor/getto-application/location/infra"
import { ResetSessionID } from "../../../kernel/data"

export type CheckPasswordResetSendingStatusProxyMaterial = Readonly<{
    checkStatus: CheckStatus["method"]
}>
export type CheckPasswordResetSendingStatusProxyMessage = CheckStatus["message"]
export type CheckPasswordResetSendingStatusProxyResponse = CheckStatus["response"]

type CheckStatus = WorkerProxySpec<
    "checkStatus",
    ConvertLocationResult<ResetSessionID>,
    CheckResetTokenSendingStatusEvent
>
