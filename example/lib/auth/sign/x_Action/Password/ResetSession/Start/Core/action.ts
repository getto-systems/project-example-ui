import { ApplicationAction } from "../../../../../../../common/vendor/getto-example/Application/action"

import {
    CheckPasswordResetSessionStatusMethod,
    StartPasswordResetSessionMethod,
} from "../../../../../password/resetSession/start/method"

import { FormConvertResult } from "../../../../../../../common/vendor/getto-form/form/data"
import { PasswordResetSessionFields } from "../../../../../password/resetSession/start/data"
import {
    CheckPasswordResetSessionStatusEvent,
    StartPasswordResetSessionEvent,
} from "../../../../../password/resetSession/start/event"

export interface StartPasswordResetSessionAction
    extends ApplicationAction<StartPasswordResetSessionState> {
    submit(fields: FormConvertResult<PasswordResetSessionFields>): void
}

export type StartPasswordResetSessionMaterial = Readonly<{
    start: StartPasswordResetSessionMethod
    checkStatus: CheckPasswordResetSessionStatusMethod
}>

export type StartPasswordResetSessionState =
    | Readonly<{ type: "initial-reset-session" }>
    | Exclude<StartPasswordResetSessionEvent, { type: "succeed-to-start-session" }>
    | CheckPasswordResetSessionStatusEvent

export const initialStartPasswordResetSessionState: StartPasswordResetSessionState = {
    type: "initial-reset-session",
}
