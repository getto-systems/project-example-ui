import { WorkerProxySpec } from "../../../../../../z_vendor/getto-application/action/worker/message"

import { AuthenticatePasswordEvent } from "../../../authenticate/event"

import { AuthenticatePasswordFields } from "../../../authenticate/data"
import { ConvertBoardResult } from "../../../../../../z_vendor/getto-application/board/kernel/data"

export type AuthenticatePasswordProxyMaterial = Readonly<{
    authenticate: Authenticate["method"]
}>
export type AuthenticatePasswordProxyMessage = Authenticate["message"]
export type AuthenticatePasswordProxyResponse = Authenticate["response"]

type Authenticate = WorkerProxySpec<
    "authenticate",
    Readonly<{ fields: ConvertBoardResult<AuthenticatePasswordFields> }>,
    AuthenticatePasswordEvent
>