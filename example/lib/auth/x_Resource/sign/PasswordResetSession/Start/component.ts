import { ApplicationComponent } from "../../../../../vendor/getto-example/Application/component"

import { PasswordResetSessionAction } from "../../../../sign/password/reset/session/action"

import {
    PasswordResetDestination,
    PasswordResetSendingStatus,
    StartPasswordResetSessionError,
    CheckPasswordResetSessionStatusError,
    SendPasswordResetSessionTokenError,
    PasswordResetSessionFields,
} from "../../../../sign/password/reset/session/data"
import { FormConvertResult } from "../../../../../vendor/getto-form/form/data"

export interface StartComponentFactory {
    (material: StartMaterial): StartComponent
}
export type StartMaterial = Readonly<{
    session: PasswordResetSessionAction
}>

export interface StartComponent extends ApplicationComponent<StartComponentState> {
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
