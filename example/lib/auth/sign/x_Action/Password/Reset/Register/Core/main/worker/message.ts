import {
    WorkerProxyMethodMessage,
    WorkerProxyMethodResponse,
} from "../../../../../../../../../common/vendor/getto-worker/main/message"

import { RegisterPasswordResetSessionEvent } from "../../../../../../../password/resetSession/register/event"

import { FormConvertResult } from "../../../../../../../../../common/vendor/getto-form/form/data"
import {
    PasswordResetFields,
    PasswordResetToken,
} from "../../../../../../../password/resetSession/register/data"

export type RegisterPasswordResetSessionProxyMessage = WorkerProxyMethodMessage<
    "register",
    RegisterPasswordResetSessionProxyParams
>
export type RegisterPasswordResetSessionProxyResponse = WorkerProxyMethodResponse<
    "register",
    RegisterPasswordResetSessionEvent
>

export type RegisterPasswordResetSessionProxyParams = Readonly<{
    fields: FormConvertResult<PasswordResetFields>
    resetToken: PasswordResetToken
}>
