import { RenewCredentialComponent } from "../renew_credential/component"

import { PasswordLoginComponent } from "../password_login/component"
import { PasswordResetSessionComponent } from "../password_reset_session/component"
import { PasswordResetComponent } from "../password_reset/component"

import { LoginIDFieldComponent } from "../field/login_id/component"
import { PasswordFieldComponent } from "../field/password/component"

export interface LoginFactory {
    (): LoginResource
}
export type LoginResource = Readonly<{
    view: LoginView
    terminate: Terminate
}>

export interface LoginView {
    onStateChange(post: Post<LoginState>): void
    load(): void
}

export type LoginState =
    | Readonly<{ type: "initial" }>
    | Readonly<{ type: "renew-credential"; components: RenewCredentialComponentSet }>
    | Readonly<{ type: "password-login"; components: PasswordLoginComponentSet }>
    | Readonly<{ type: "password-reset-session"; components: PasswordResetSessionComponentSet }>
    | Readonly<{ type: "password-reset"; components: PasswordResetComponentSet }>
    | Readonly<{ type: "error"; err: string }>

export type ViewState = "password-login" | "password-reset-session" | "password-reset"

export const initialLoginState: LoginState = { type: "initial" }

export type RenewCredentialComponentSet = Readonly<{
    renewCredential: RenewCredentialComponent
}>
export type PasswordLoginComponentSet = Readonly<{
    passwordLogin: PasswordLoginComponent
    loginIDField: LoginIDFieldComponent
    passwordField: PasswordFieldComponent
}>
export type PasswordResetSessionComponentSet = Readonly<{
    passwordResetSession: PasswordResetSessionComponent
    loginIDField: LoginIDFieldComponent
}>
export type PasswordResetComponentSet = Readonly<{
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
