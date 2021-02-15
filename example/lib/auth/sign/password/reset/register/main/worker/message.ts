import {
    WorkerProxyMethodMessage,
    WorkerProxyMethodResponse,
} from "../../../../../../../vendor/getto-worker/main/message"

import { SubmitPasswordResetRegisterEvent } from "../../event"

import { FormConvertResult } from "../../../../../../../vendor/getto-form/form/data"
import { PasswordResetFields, PasswordResetToken } from "../../data"

export type RegisterActionProxyMessage = WorkerProxyMethodMessage<"submit", SubmitProxyParams>
export type RegisterActionProxyResponse = WorkerProxyMethodResponse<"submit", SubmitPasswordResetRegisterEvent>

export type SubmitProxyParams = Readonly<{
    fields: FormConvertResult<PasswordResetFields>
    resetToken: PasswordResetToken
}>
