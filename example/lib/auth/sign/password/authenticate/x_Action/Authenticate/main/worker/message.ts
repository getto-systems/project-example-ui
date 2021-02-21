import { WorkerProxySpec } from "../../../../../../../../z_getto/application/worker/message"

import { AuthenticatePasswordEvent } from "../../../../event"

import { AuthenticatePasswordFields } from "../../../../data"
import { BoardConvertResult } from "../../../../../../../../z_getto/board/kernel/data"

export type AuthenticatePasswordProxyMaterial = Readonly<{
    authenticate: Authenticate["method"]
}>
export type AuthenticatePasswordProxyMessage = Authenticate["message"]
export type AuthenticatePasswordProxyResponse = Authenticate["response"]

type Authenticate = WorkerProxySpec<
    "authenticate",
    Readonly<{ fields: BoardConvertResult<AuthenticatePasswordFields> }>,
    AuthenticatePasswordEvent
>
