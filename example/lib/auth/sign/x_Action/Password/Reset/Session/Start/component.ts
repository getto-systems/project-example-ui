import { ApplicationAction } from "../../../../../../../common/vendor/getto-example/Application/action"

import { PasswordResetSessionAction } from "../../../../../password/resetSession/start/action"

import {
    PasswordResetDestination,
    PasswordResetSendingStatus,
    StartPasswordResetSessionError,
    CheckPasswordResetSessionStatusError,
    SendPasswordResetSessionTokenError,
    PasswordResetSessionFields,
} from "../../../../../password/resetSession/start/data"
import { FormConvertResult } from "../../../../../../../common/vendor/getto-form/form/data"

export interface StartComponentFactory {
    (material: PasswordResetSessionStartMaterial): PasswordResetSessionStartComponent
}
export type PasswordResetSessionStartMaterial = Readonly<{
    session: PasswordResetSessionAction
}>

export interface PasswordResetSessionStartComponent extends ApplicationAction<StartComponentState> {
    submit(fields: FormConvertResult<PasswordResetSessionFields>): void
}

export type StartComponentState =
    | Readonly<{ type: "initial-reset-session" }>
    | Readonly<{ type: "try-to-start-session" }>
    | Readonly<{ type: "delayed-to-start-session" }>
    | Readonly<{ type: "failed-to-start-session"; err: StartPasswordResetSessionError }>
    | Readonly<{ type: "try-to-check-status" }>
    | Readonly<{
          type: "retry-to-check-status"
          dest: PasswordResetDestination
          status: PasswordResetSendingStatus
      }>
    | Readonly<{ type: "failed-to-check-status"; err: CheckPasswordResetSessionStatusError }>
    | Readonly<{
          type: "failed-to-send-token"
          dest: PasswordResetDestination
          err: SendPasswordResetSessionTokenError
      }>
    | Readonly<{ type: "succeed-to-send-token"; dest: PasswordResetDestination }>
    | Readonly<{ type: "error"; err: string }>

export const initialStartComponentState: StartComponentState = {
    type: "initial-reset-session",
}
