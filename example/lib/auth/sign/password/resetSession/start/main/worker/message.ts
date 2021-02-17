import {
    WorkerProxyMessage,
    WorkerProxyResponse,
} from "../../../../../../../common/vendor/getto-worker/main/message"

import { CheckPasswordResetSessionStatusEvent, StartPasswordResetSessionEvent } from "../../event"

import { FormConvertResult } from "../../../../../../../common/vendor/getto-form/form/data"
import { PasswordResetSessionID, PasswordResetSessionFields } from "../../data"

export type PasswordResetSessionActionProxyMessage =
    | WorkerProxyMessage<"start", StartPasswordResetSessionProxyParams>
    | WorkerProxyMessage<"checkStatus", CheckPasswordResetSessionStatusProxyParams>

export type PasswordResetSessionActionProxyResponse =
    | WorkerProxyResponse<"start", StartPasswordResetSessionEvent>
    | WorkerProxyResponse<"checkStatus", CheckPasswordResetSessionStatusEvent>

export type StartPasswordResetSessionProxyParams = Readonly<{
    fields: FormConvertResult<PasswordResetSessionFields>
}>
export type CheckPasswordResetSessionStatusProxyParams = Readonly<{
    sessionID: PasswordResetSessionID
}>
