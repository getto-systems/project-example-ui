import {
    WorkerProxyMessage,
    WorkerProxyMethod,
    WorkerProxyResponse,
} from "../../../../../../../../../z_vendor/getto-worker/message"

import { RegisterPasswordEvent } from "../../../../../../../password/resetSession/register/event"

import { FormConvertResult } from "../../../../../../../../../common/vendor/getto-form/form/data"
import {
    PasswordResetFields,
    PasswordResetToken,
} from "../../../../../../../password/resetSession/register/data"

export type RegisterPasswordProxyMethod = WorkerProxyMethod<
    RegisterPasswordProxyParams,
    RegisterPasswordEvent
>
export type RegisterPasswordProxyMessage = WorkerProxyMessage<
    "register",
    RegisterPasswordProxyParams
>
export type RegisterPasswordProxyResponse = WorkerProxyResponse<"register", RegisterPasswordEvent>

export type RegisterPasswordProxyParams = Readonly<{
    fields: FormConvertResult<PasswordResetFields>
    resetToken: PasswordResetToken
}>
