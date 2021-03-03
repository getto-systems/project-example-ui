import { ApplicationStateAction } from "../../../../z_vendor/getto-application/action/action"
import { CheckAuthInfoEntryPoint } from "../../../../auth/sign/kernel/authInfo/check/Action/action"
import { AuthenticatePasswordEntryPoint } from "../../../../auth/sign/password/authenticate/x_Action/Authenticate/action"
import { RequestPasswordResetTokenEntryPoint } from "../../../../auth/sign/password/reset/requestToken/x_Action/RequestToken/action"
import { CheckPasswordResetSendingStatusEntryPoint } from "../../../../auth/sign/password/reset/checkStatus/x_Action/CheckStatus/action"
import { ResetPasswordEntryPoint } from "../../../../auth/sign/password/reset/reset/x_Action/Reset/action"

export type AuthSignEntryPoint = Readonly<{
    resource: AuthSignResource
    terminate: Terminate
}>
export type AuthSignResource = Readonly<{
    view: AuthSignAction
}>

export interface AuthSignSubEntryPoint {
    renew(): CheckAuthInfoEntryPoint

    password_authenticate(): AuthenticatePasswordEntryPoint

    password_reset_requestToken(): RequestPasswordResetTokenEntryPoint
    password_reset_checkStatus(): CheckPasswordResetSendingStatusEntryPoint
    password_reset(): ResetPasswordEntryPoint
}

export interface AuthSignViewLocationInfo {
    getAuthSignViewType(): AuthSignViewType
}

export interface AuthSignAction extends ApplicationStateAction<AuthSignActionState> {
    error(err: string): void
}

export type AuthSignActionState =
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

export type AuthSignViewType =
    | "password-authenticate"
    | "password-reset-requestToken"
    | "password-reset-checkStatus"
    | "password-reset"

export const initialAuthSignViewState: AuthSignActionState = { type: "initial-view" }

interface Terminate {
    (): void
}
