import { WorkerProxySpec } from "../../../../../../../../../z_vendor/getto-worker/message"

import { AuthenticatePasswordEvent } from "../../../../../event"

import { FormConvertResult } from "../../../../../../../../../common/vendor/getto-form/form/data"
import { AuthenticatePasswordFields } from "../../../../../data"

export type AuthenticatePasswordProxyMessage = Authenticate["message"]
export type AuthenticatePasswordProxyResponse = Authenticate["response"]

export type AuthenticatePasswordProxyMethod = Authenticate["method"]
type Authenticate = WorkerProxySpec<
    "authenticate",
    Readonly<{ fields: FormConvertResult<AuthenticatePasswordFields> }>,
    AuthenticatePasswordEvent
>
