import {
    WorkerProxyMethodMessage,
    WorkerProxyMethodResponse,
} from "../../../../../../../common/vendor/getto-worker/main/message"

import { SubmitPasswordResetRegisterEvent } from "../../event"

import { FormConvertResult } from "../../../../../../../common/vendor/getto-form/form/data"
import { PasswordResetFields, PasswordResetToken } from "../../data"

export type PasswordResetRegisterActionProxyMessage = WorkerProxyMethodMessage<
    "submit",
    SubmitPasswordResetRegisterProxyParams
>
export type PasswordResetRegisterActionProxyResponse = WorkerProxyMethodResponse<
    "submit",
    SubmitPasswordResetRegisterEvent
>

export type SubmitPasswordResetRegisterProxyParams = Readonly<{
    fields: FormConvertResult<PasswordResetFields>
    resetToken: PasswordResetToken
}>
