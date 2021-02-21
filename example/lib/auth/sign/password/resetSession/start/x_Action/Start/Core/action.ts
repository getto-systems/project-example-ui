import { ApplicationAction } from "../../../../../../../../z_getto/application/action"

import {
    CheckPasswordResetSessionStatusMethod,
    StartPasswordResetSessionMethod,
} from "../../../method"

import {
    CheckPasswordResetSessionStatusEvent,
    StartPasswordResetSessionEvent,
} from "../../../event"

import { BoardConvertResult } from "../../../../../../../../z_getto/board/kernel/data"
import { PasswordResetSessionFields } from "../../../data"

export interface StartPasswordResetSessionCoreAction
    extends ApplicationAction<StartPasswordResetSessionCoreState> {
    submit(fields: BoardConvertResult<PasswordResetSessionFields>): void
}

export type StartPasswordResetSessionCoreMaterial = Readonly<{
    start: StartPasswordResetSessionMethod
    checkStatus: CheckPasswordResetSessionStatusMethod
}>

export type StartPasswordResetSessionCoreState =
    | Readonly<{ type: "initial-reset-session" }>
    | Exclude<StartPasswordResetSessionEvent, { type: "succeed-to-start-session" }>
    | CheckPasswordResetSessionStatusEvent

export const initialStartPasswordResetSessionCoreState: StartPasswordResetSessionCoreState = {
    type: "initial-reset-session",
}
