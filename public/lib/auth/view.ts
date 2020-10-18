import { AppHref } from "../href"

import { RenewCredentialComponent } from "./component/renew_credential/component"

import { PasswordLoginComponent } from "./component/password_login/component"
import { PasswordResetSessionComponent } from "./component/password_reset_session/component"
import { PasswordResetComponent } from "./component/password_reset/component"

import { LoginIDFieldComponent } from "./component/field/login_id/component"
import { PasswordFieldComponent } from "./component/field/password/component"

export interface AuthInit {
    (currentLocation: Location): AuthResource
}
export type AuthResource = Readonly<{
    view: AuthView
    terminate: Terminate
}>

export interface AuthInitWorker {
    (worker: Worker): void
}

export interface AuthView {
    onStateChange(post: Post<AuthState>): void
    load(): void
    readonly components: AuthComponentSet
}
export type AuthComponentSet = Readonly<{
    renewCredential: Init<Readonly<{
        renewCredential: RenewCredentialComponent
    }>>

    passwordLogin: Init<Readonly<{
        href: AppHref
        passwordLogin: PasswordLoginComponent
        loginIDField: LoginIDFieldComponent
        passwordField: PasswordFieldComponent
    }>>
    passwordResetSession: Init<Readonly<{
        href: AppHref
        passwordResetSession: PasswordResetSessionComponent
        loginIDField: LoginIDFieldComponent
    }>>
    passwordReset: Init<Readonly<{
        href: AppHref
        passwordReset: PasswordResetComponent
        loginIDField: LoginIDFieldComponent
        passwordField: PasswordFieldComponent
    }>>
}>

export type AuthState =
    Readonly<{ type: "initial" }> |
    Readonly<{ type: "renew-credential" }> |
    Readonly<{ type: "password-login" }> |
    Readonly<{ type: "password-reset-session" }> |
    Readonly<{ type: "password-reset" }> |
    Readonly<{ type: "error", err: string }>

export const initialAuthState: AuthState = { type: "initial" }

interface Post<T> {
    (state: T): void
}
interface Init<T> {
    (): T
}
interface Terminate {
    (): void
}
