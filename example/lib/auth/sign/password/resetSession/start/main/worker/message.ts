import {
    WorkerProxyMethodMessage,
    WorkerProxyMethodResponse,
} from "../../../../../../../vendor/getto-worker/main/message"

import { CheckPasswordResetSessionStatusEvent, StartPasswordResetSessionEvent } from "../../event"

import { FormConvertResult } from "../../../../../../../vendor/getto-form/form/data"
import { PasswordResetSessionID, PasswordResetSessionFields } from "../../data"

export type PasswordResetSessionActionProxyMessage =
    | WorkerProxyMethodMessage<"start", StartPasswordResetSessionProxyParams>
    | WorkerProxyMethodMessage<"checkStatus", CheckPasswordResetSessionStatusProxyParams>

export type PasswordResetSessionActionProxyResponse =
    | WorkerProxyMethodResponse<"start", StartPasswordResetSessionEvent>
    | WorkerProxyMethodResponse<"checkStatus", CheckPasswordResetSessionStatusEvent>

export type StartPasswordResetSessionProxyParams = Readonly<{
    fields: FormConvertResult<PasswordResetSessionFields>
}>
export type CheckPasswordResetSessionStatusProxyParams = Readonly<{
    sessionID: PasswordResetSessionID
}>
