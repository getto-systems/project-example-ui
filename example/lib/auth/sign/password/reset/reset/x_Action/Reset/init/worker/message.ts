import { WorkerProxySpec } from "../../../../../../../../../z_vendor/getto-application/action/worker/message"

import { ResetEvent } from "../../../../event"

import { BoardConvertResult } from "../../../../../../../../../z_vendor/getto-application/board/kernel/data"
import { ResetFields } from "../../../../data"
import { ResetToken } from "../../../../../kernel/data"

export type ResetPasswordProxyMaterial = Readonly<{
    reset: Reset["method"]
}>
export type ResetPasswordProxyMessage = Reset["message"]
export type ResetPasswordProxyResponse = Reset["response"]

type Reset = WorkerProxySpec<
    "reset",
    Readonly<{ fields: BoardConvertResult<ResetFields>; resetToken: ResetToken }>,
    ResetEvent
>
