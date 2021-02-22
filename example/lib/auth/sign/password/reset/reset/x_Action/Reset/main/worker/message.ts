import { WorkerProxySpec } from "../../../../../../../../../z_getto/application/worker/message"

import { ResetPasswordEvent } from "../../../../event"

import { BoardConvertResult } from "../../../../../../../../../z_getto/board/kernel/data"
import { PasswordResetFields } from "../../../../data"
import { PasswordResetToken } from "../../../../../kernel/data"

export type ResetPasswordProxyMaterial = Readonly<{
    reset: Reset["method"]
}>
export type ResetPasswordProxyMessage = Reset["message"]
export type ResetPasswordProxyResponse = Reset["response"]

type Reset = WorkerProxySpec<
    "reset",
    Readonly<{ fields: BoardConvertResult<PasswordResetFields>; resetToken: PasswordResetToken }>,
    ResetPasswordEvent
>
