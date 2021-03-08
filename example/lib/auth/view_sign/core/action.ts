import { ApplicationStateAction } from "../../../z_vendor/getto-application/action/action"

import { CheckAuthInfoEntryPoint } from "../../sign/kernel/auth_info/action_check/entry_point"
import { AuthenticatePasswordEntryPoint } from "../../sign/password/view_authenticate/entry_point"
import { CheckResetTokenSendingStatusEntryPoint } from "../../sign/password/reset/view_check_status/entry_point"
import { RequestResetTokenEntryPoint } from "../../sign/password/reset/view_request_token/entry_point"
import { ResetPasswordEntryPoint } from "../../sign/password/reset/view_reset/entry_point"

export interface SignAction extends ApplicationStateAction<SignActionState> {
    error(err: string): void
}

export interface SignSubEntryPoint {
    renew(): CheckAuthInfoEntryPoint

    password_authenticate(): AuthenticatePasswordEntryPoint

    password_reset_requestToken(): RequestResetTokenEntryPoint
    password_reset_checkStatus(): CheckResetTokenSendingStatusEntryPoint
    password_reset(): ResetPasswordEntryPoint
}

export type SignActionState =
    | Readonly<{ type: "initial-view" }>
    | Readonly<{ type: "renew-credential"; entryPoint: CheckAuthInfoEntryPoint }>
    | Readonly<{ type: "password-authenticate"; entryPoint: AuthenticatePasswordEntryPoint }>
    | Readonly<{
          type: "password-reset-requestToken"
          entryPoint: RequestResetTokenEntryPoint
      }>
    | Readonly<{
          type: "password-reset-checkStatus"
          entryPoint: CheckResetTokenSendingStatusEntryPoint
      }>
    | Readonly<{ type: "password-reset"; entryPoint: ResetPasswordEntryPoint }>
    | Readonly<{ type: "error"; err: string }>

export const initialSignViewState: SignActionState = { type: "initial-view" }
