import {
    WorkerProxyMethodMessage,
    WorkerProxyMethodResponse,
} from "../../../../../../../../common/vendor/getto-worker/main/message"

import { AuthenticatePasswordEvent } from "../../../../../../password/authenticate/event"

import { FormConvertResult } from "../../../../../../../../common/vendor/getto-form/form/data"
import { AuthenticatePasswordFields } from "../../../../../../password/authenticate/data"

export type AuthenticatePasswordProxyMessage = WorkerProxyMethodMessage<
    "authenticate",
    AuthenticatePasswordProxyParams
>
export type AuthenticatePasswordProxyResponse = WorkerProxyMethodResponse<
    "authenticate",
    AuthenticatePasswordEvent
>

export type AuthenticatePasswordProxyParams = Readonly<{
    fields: FormConvertResult<AuthenticatePasswordFields>
}>
