import { WorkerProxySpec } from "../../../../../../../../../z_getto/application/worker/message"

import { RegisterPasswordEvent } from "../../../../event"

import { BoardConvertResult } from "../../../../../../../../../z_getto/board/kernel/data"
import { PasswordResetFields, PasswordResetToken } from "../../../../data"

export type RegisterPasswordProxyMaterial = Readonly<{
    reset: Register["method"]
}>
export type RegisterPasswordProxyMessage = Register["message"]
export type RegisterPasswordProxyResponse = Register["response"]

type Register = WorkerProxySpec<
    "register",
    Readonly<{ fields: BoardConvertResult<PasswordResetFields>; resetToken: PasswordResetToken }>,
    RegisterPasswordEvent
>
