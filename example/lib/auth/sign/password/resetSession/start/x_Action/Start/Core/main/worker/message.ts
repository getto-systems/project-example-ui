import { WorkerProxySpec } from "../../../../../../../../../../z_getto/application/worker/message"

import {
    CheckPasswordResetSessionStatusEvent,
    StartPasswordResetSessionEvent,
} from "../../../../../event"

import { FormConvertResult } from "../../../../../../../../../../z_getto/getto-form/form/data"
import {
    PasswordResetSessionFields,
    PasswordResetSessionID,
} from "../../../../../data"

export type StartPasswordResetSessionProxyMessage = Start["message"] | CheckStatus["message"]

export type StartPasswordResetSessionProxyResponse = Start["response"] | CheckStatus["response"]

export type StartPasswordResetSessionProxyParams = Readonly<{
    fields: FormConvertResult<PasswordResetSessionFields>
}>
export type CheckPasswordResetSessionStatusProxyParams = Readonly<{
    sessionID: PasswordResetSessionID
}>

export type StartPasswordResetSessionProxyMethod = Start["method"]
type Start = WorkerProxySpec<
    "start",
    Readonly<{ fields: FormConvertResult<PasswordResetSessionFields> }>,
    StartPasswordResetSessionEvent
>

export type CheckPasswordResetSessionStatusProxyMethod = CheckStatus["method"]
type CheckStatus = WorkerProxySpec<
    "checkStatus",
    Readonly<{ sessionID: PasswordResetSessionID }>,
    CheckPasswordResetSessionStatusEvent
>
