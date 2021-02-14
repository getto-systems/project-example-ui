import {
    WorkerProxyMethodMessage,
    WorkerProxyMethodResponse,
} from "../../../../../../common/getto-worker/worker/message"

import { CheckStatusEvent, StartSessionEvent } from "../event"

import { FormConvertResult } from "../../../../../../common/getto-form/form/data"
import { SessionID, StartSessionFields } from "../data"

export type SessionActionProxyMessage =
    | WorkerProxyMethodMessage<"startSession", StartSessionProxyParams>
    | WorkerProxyMethodMessage<"checkStatus", CheckStatusProxyParams>

export type SessionActionProxyResponse =
    | WorkerProxyMethodResponse<"startSession", StartSessionEvent>
    | WorkerProxyMethodResponse<"checkStatus", CheckStatusEvent>

export type StartSessionProxyParams = Readonly<{
    fields: FormConvertResult<StartSessionFields>
}>
export type CheckStatusProxyParams = Readonly<{
    sessionID: SessionID
}>
