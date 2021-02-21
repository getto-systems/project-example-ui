import { WorkerProxySpec } from "../../../../../../../../../z_getto/application/worker/message"

import {
    CheckPasswordResetSessionStatusEvent,
    StartPasswordResetSessionEvent,
} from "../../../../event"

import { BoardConvertResult } from "../../../../../../../../../z_getto/board/kernel/data"
import { PasswordResetSessionFields, PasswordResetSessionID } from "../../../../data"

export type StartPasswordResetSessionProxyMaterial = Readonly<{
    start: Start["method"]
    checkStatus: CheckStatus["method"]
}>
export type StartPasswordResetSessionProxyMessage = Start["message"] | CheckStatus["message"]
export type StartPasswordResetSessionProxyResponse = Start["response"] | CheckStatus["response"]

type Start = WorkerProxySpec<
    "start",
    Readonly<{ fields: BoardConvertResult<PasswordResetSessionFields> }>,
    StartPasswordResetSessionEvent
>
type CheckStatus = WorkerProxySpec<
    "checkStatus",
    Readonly<{ sessionID: PasswordResetSessionID }>,
    CheckPasswordResetSessionStatusEvent
>
