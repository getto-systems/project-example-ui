import { WorkerProxySpec } from "../../../../../../../../z_vendor/getto-application/action/worker/message"

import { AuthenticateEvent } from "../../../../event"

import { AuthenticateFields } from "../../../../data"
import { BoardConvertResult } from "../../../../../../../../z_vendor/getto-application/board/kernel/data"

export type AuthenticatePasswordProxyMaterial = Readonly<{
    authenticate: Authenticate["method"]
}>
export type AuthenticatePasswordProxyMessage = Authenticate["message"]
export type AuthenticatePasswordProxyResponse = Authenticate["response"]

type Authenticate = WorkerProxySpec<
    "authenticate",
    Readonly<{ fields: BoardConvertResult<AuthenticateFields> }>,
    AuthenticateEvent
>
