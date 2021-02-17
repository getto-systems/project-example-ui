import {
    WorkerProxyMessage,
    WorkerProxyResponse,
} from "../../../../../../../../../common/vendor/getto-worker/main/message"

import {
    CheckPasswordResetSessionStatusEvent,
    StartPasswordResetSessionEvent,
} from "../../../../../../../password/resetSession/start/event"

import { FormConvertResult } from "../../../../../../../../../common/vendor/getto-form/form/data"
import {
    PasswordResetSessionFields,
    PasswordResetSessionID,
} from "../../../../../../../password/resetSession/start/data"

export type StartPasswordResetSessionProxyMessage =
    | WorkerProxyMessage<"start", StartPasswordResetSessionProxyParams>
    | WorkerProxyMessage<"checkStatus", CheckPasswordResetSessionStatusProxyParams>

export type StartPasswordResetSessionProxyResponse =
    | WorkerProxyResponse<"start", StartPasswordResetSessionEvent>
    | WorkerProxyResponse<"checkStatus", CheckPasswordResetSessionStatusEvent>

export type StartPasswordResetSessionProxyParams = Readonly<{
    fields: FormConvertResult<PasswordResetSessionFields>
}>
export type CheckPasswordResetSessionStatusProxyParams = Readonly<{
    sessionID: PasswordResetSessionID
}>
