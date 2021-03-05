import { ApplicationStateAction } from "../../../../../z_vendor/getto-application/action/action"

import { CheckAuthInfoEntryPoint } from "../../../kernel/authInfo/check/Action/entryPoint"
import { AuthenticatePasswordEntryPoint } from "../../../password/authenticate/Action/entryPoint"
import { CheckPasswordResetSendingStatusEntryPoint } from "../../../password/reset/checkStatus/x_Action/CheckStatus/action"
import { RequestPasswordResetTokenEntryPoint } from "../../../password/reset/requestToken/x_Action/RequestToken/action"
import { ResetPasswordEntryPoint } from "../../../password/reset/reset/x_Action/Reset/action"

export interface SignAction extends ApplicationStateAction<SignActionState> {
    error(err: string): void
}

export interface SignSubEntryPoint {
    renew(): CheckAuthInfoEntryPoint

    password_authenticate(): AuthenticatePasswordEntryPoint

    password_reset_requestToken(): RequestPasswordResetTokenEntryPoint
    password_reset_checkStatus(): CheckPasswordResetSendingStatusEntryPoint
    password_reset(): ResetPasswordEntryPoint
}

export type SignActionState =
    | Readonly<{ type: "initial-view" }>
    | Readonly<{ type: "renew-credential"; entryPoint: CheckAuthInfoEntryPoint }>
    | Readonly<{ type: "password-authenticate"; entryPoint: AuthenticatePasswordEntryPoint }>
    | Readonly<{
          type: "password-reset-requestToken"
          entryPoint: RequestPasswordResetTokenEntryPoint
      }>
    | Readonly<{
          type: "password-reset-checkStatus"
          entryPoint: CheckPasswordResetSendingStatusEntryPoint
      }>
    | Readonly<{ type: "password-reset"; entryPoint: ResetPasswordEntryPoint }>
    | Readonly<{ type: "error"; err: string }>

export const initialSignViewState: SignActionState = { type: "initial-view" }
