import { RenewCredentialComponent } from "../renew_credential/component"

import { PasswordLoginComponent } from "../password_login/component"
import { PasswordResetSessionComponent } from "../password_reset_session/component"
import { PasswordResetComponent } from "../password_reset/component"

import { LoginIDFieldComponent } from "../field/login_id/component"
import { PasswordFieldComponent } from "../field/password/component"

export interface LoginEntryPointFactory {
    (): LoginEntryPoint
}
export type LoginEntryPoint = Readonly<{
    view: LoginView
    terminate: Terminate
}>

export interface LoginView {
    onStateChange(post: Post<LoginState>): void
    load(): void
}

export type LoginState =
    | Readonly<{ type: "initial-view" }>
    | Readonly<{ type: "renew-credential"; resource: RenewCredentialResource }>
    | Readonly<{ type: "password-login"; resource: PasswordLoginResource }>
    | Readonly<{ type: "password-reset-session"; resource: PasswordResetSessionResource }>
    | Readonly<{ type: "password-reset"; resource: PasswordResetResource }>
    | Readonly<{ type: "error"; err: string }>

export type ViewState = "password-login" | "password-reset-session" | "password-reset"

export const initialLoginState: LoginState = { type: "initial-view" }

export type RenewCredentialResource = Readonly<{
    renewCredential: RenewCredentialComponent
}>
export type PasswordLoginResource = Readonly<{
    passwordLogin: PasswordLoginComponent
    loginIDField: LoginIDFieldComponent
    passwordField: PasswordFieldComponent
}>
export type PasswordResetSessionResource = Readonly<{
    passwordResetSession: PasswordResetSessionComponent
    loginIDField: LoginIDFieldComponent
}>
export type PasswordResetResource = Readonly<{
    passwordReset: PasswordResetComponent
    loginIDField: LoginIDFieldComponent
    passwordField: PasswordFieldComponent
}>

interface Post<T> {
    (state: T): void
}
interface Terminate {
    (): void
}
