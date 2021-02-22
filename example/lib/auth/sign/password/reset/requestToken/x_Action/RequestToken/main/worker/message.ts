import { WorkerProxySpec } from "../../../../../../../../../z_getto/application/worker/message"

import { RequestPasswordResetTokenEvent } from "../../../../event"

import { BoardConvertResult } from "../../../../../../../../../z_getto/board/kernel/data"
import { PasswordResetRequestFields } from "../../../../data"

export type RequestPasswordResetTokenProxyMaterial = Readonly<{
    request: RequestToken["method"]
}>
export type RequestPasswordResetTokenProxyMessage = RequestToken["message"]
export type RequestPasswordResetTokenProxyResponse = RequestToken["response"]

type RequestToken = WorkerProxySpec<
    "request",
    Readonly<{ fields: BoardConvertResult<PasswordResetRequestFields> }>,
    RequestPasswordResetTokenEvent
>
