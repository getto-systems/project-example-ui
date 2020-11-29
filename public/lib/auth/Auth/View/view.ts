import { AppHref } from "../../Href/data"

import { RenewCredentialComponent } from "../renew_credential/component"

import { PasswordLoginComponent } from "../password_login/component"
import { PasswordResetSessionComponent } from "../password_reset_session/component"
import { PasswordResetComponent } from "../password_reset/component"

import { LoginIDFieldComponent } from "../field/login_id/component"
import { PasswordFieldComponent } from "../field/password/component"

export interface AuthFactory {
    (): AuthResource
}
export type AuthResource = Readonly<{
    view: AuthView
    terminate: Terminate
}>

export interface AuthView {
    onStateChange(post: Post<AuthState>): void
    load(): void
}

export type AuthState =
    | Readonly<{ type: "initial" }>
    | Readonly<{ type: "renew-credential"; components: RenewCredentialComponentSet }>
    | Readonly<{ type: "password-login"; components: PasswordLoginComponentSet }>
    | Readonly<{ type: "password-reset-session"; components: PasswordResetSessionComponentSet }>
    | Readonly<{ type: "password-reset"; components: PasswordResetComponentSet }>
    | Readonly<{ type: "error"; err: string }>

export type LoginState = "password-login" | "password-reset-session" | "password-reset"

export const initialAuthState: AuthState = { type: "initial" }

export type RenewCredentialComponentSet = Readonly<{
    renewCredential: RenewCredentialComponent
}>
export type PasswordLoginComponentSet = Readonly<{
    href: AppHref
    passwordLogin: PasswordLoginComponent
    loginIDField: LoginIDFieldComponent
    passwordField: PasswordFieldComponent
}>
export type PasswordResetSessionComponentSet = Readonly<{
    href: AppHref
    passwordResetSession: PasswordResetSessionComponent
    loginIDField: LoginIDFieldComponent
}>
export type PasswordResetComponentSet = Readonly<{
    href: AppHref
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
