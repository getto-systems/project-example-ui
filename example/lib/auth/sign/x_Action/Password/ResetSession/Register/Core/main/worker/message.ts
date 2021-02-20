import { WorkerProxySpec } from "../../../../../../../../../z_getto/worker/message"

import { RegisterPasswordEvent } from "../../../../../../../password/resetSession/register/event"

import { FormConvertResult } from "../../../../../../../../../z_getto/getto-form/form/data"
import {
    PasswordResetFields,
    PasswordResetToken,
} from "../../../../../../../password/resetSession/register/data"

export type RegisterPasswordProxyMessage = Register["message"]
export type RegisterPasswordProxyResponse = Register["response"]

export type RegisterPasswordProxyMethod = Register["method"]
type Register = WorkerProxySpec<
    "register",
    Readonly<{ fields: FormConvertResult<PasswordResetFields>; resetToken: PasswordResetToken }>,
    RegisterPasswordEvent
>
