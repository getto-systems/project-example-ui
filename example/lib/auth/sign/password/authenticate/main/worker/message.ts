import {
    WorkerProxyMethodMessage,
    WorkerProxyMethodResponse,
} from "../../../../../../vendor/getto-worker/main/message"

import { AuthenticatePasswordEvent } from "../../event"

import { FormConvertResult } from "../../../../../../vendor/getto-form/form/data"
import { PasswordLoginFields } from "../../data"

export type PasswordLoginActionProxyMessage = WorkerProxyMethodMessage<
    "submit",
    SubmitPasswordLoginProxyParams
>
export type PasswordLoginActionProxyResponse = WorkerProxyMethodResponse<
    "submit",
    AuthenticatePasswordEvent
>

export type SubmitPasswordLoginProxyParams = Readonly<{ fields: FormConvertResult<PasswordLoginFields> }>
