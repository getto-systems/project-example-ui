import { WorkerProxySpec } from "../../../../../../../../../z_getto/action/worker/message"

import { RequestTokenEvent } from "../../../../event"

import { BoardConvertResult } from "../../../../../../../../../z_getto/board/kernel/data"
import { RequestTokenFields } from "../../../../data"

export type RequestPasswordResetTokenProxyMaterial = Readonly<{
    requestToken: RequestToken["method"]
}>
export type RequestPasswordResetTokenProxyMessage = RequestToken["message"]
export type RequestPasswordResetTokenProxyResponse = RequestToken["response"]

type RequestToken = WorkerProxySpec<
    "requestToken",
    Readonly<{ fields: BoardConvertResult<RequestTokenFields> }>,
    RequestTokenEvent
>
