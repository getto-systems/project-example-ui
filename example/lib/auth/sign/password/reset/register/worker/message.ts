import {
    WorkerProxyMethodMessage,
    WorkerProxyMethodResponse,
} from "../../../../../../vendor/getto-worker/worker/message"

import { SubmitEvent } from "../event"

import { FormConvertResult } from "../../../../../../vendor/getto-form/form/data"
import { ResetFields, ResetToken } from "../data"

export type RegisterActionProxyMessage = WorkerProxyMethodMessage<"submit", SubmitProxyParams>
export type RegisterActionProxyResponse = WorkerProxyMethodResponse<"submit", SubmitEvent>

export type SubmitProxyParams = Readonly<{
    fields: FormConvertResult<ResetFields>
    resetToken: ResetToken
}>
