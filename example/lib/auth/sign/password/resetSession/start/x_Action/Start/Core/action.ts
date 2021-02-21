import { ApplicationAction } from "../../../../../../../../z_getto/application/action"

import {
    CheckPasswordResetSessionStatusMethod,
    StartPasswordResetSessionMethod,
} from "../../../method"

import { FormConvertResult } from "../../../../../../../../z_getto/getto-form/form/data"
import { PasswordResetSessionFields } from "../../../data"
import {
    CheckPasswordResetSessionStatusEvent,
    StartPasswordResetSessionEvent,
} from "../../../event"

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
