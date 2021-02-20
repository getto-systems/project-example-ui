import { WorkerProxySpec } from "../../../../../../../../z_getto/worker/message"

import { AuthenticatePasswordEvent } from "../../../../event"

import { FormConvertResult } from "../../../../../../../../z_getto/getto-form/form/data"
import { AuthenticatePasswordFields } from "../../../../data"

export type AuthenticatePasswordProxyMaterial = Readonly<{
    authenticate: Authenticate["method"]
}>
export type AuthenticatePasswordProxyMessage = Authenticate["message"]
export type AuthenticatePasswordProxyResponse = Authenticate["response"]

type Authenticate = WorkerProxySpec<
    "authenticate",
    Readonly<{ fields: FormConvertResult<AuthenticatePasswordFields> }>,
    AuthenticatePasswordEvent
>
