import {
    WorkerProxyMessage,
    WorkerProxyResponse,
} from "../../../../../../../../common/vendor/getto-worker/main/message"

import { AuthenticatePasswordEvent } from "../../../../../../password/authenticate/event"

import { FormConvertResult } from "../../../../../../../../common/vendor/getto-form/form/data"
import { AuthenticatePasswordFields } from "../../../../../../password/authenticate/data"

export type AuthenticatePasswordProxyMessage = WorkerProxyMessage<
    "authenticate",
    AuthenticatePasswordProxyParams
>
export type AuthenticatePasswordProxyResponse = WorkerProxyResponse<
    "authenticate",
    AuthenticatePasswordEvent
>

export type AuthenticatePasswordProxyParams = Readonly<{
    fields: FormConvertResult<AuthenticatePasswordFields>
}>
