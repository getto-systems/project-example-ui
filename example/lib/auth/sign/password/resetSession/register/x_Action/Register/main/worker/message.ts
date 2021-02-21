import { WorkerProxySpec } from "../../../../../../../../../z_getto/application/worker/message"

import { RegisterPasswordEvent } from "../../../../event"

import { FormConvertResult } from "../../../../../../../../../z_getto/getto-form/form/data"
import { PasswordResetFields, PasswordResetToken } from "../../../../data"

export type RegisterPasswordProxyMaterial = Readonly<{
    reset: Register["method"]
}>

export type RegisterPasswordProxyMessage = Register["message"]
export type RegisterPasswordProxyResponse = Register["response"]

export type RegisterPasswordProxyMethod = Register["method"]
type Register = WorkerProxySpec<
    "register",
    Readonly<{ fields: FormConvertResult<PasswordResetFields>; resetToken: PasswordResetToken }>,
    RegisterPasswordEvent
>
