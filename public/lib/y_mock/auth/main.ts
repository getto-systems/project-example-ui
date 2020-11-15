import { newAppHref } from "../../main/href"

import { newRenewCredentialComponent } from "./renew_credential"

import { newPasswordLoginComponent } from "./password_login"
import { newPasswordResetSessionComponent } from "./password_reset_session"
import { newPasswordResetComponent } from "./password_reset"

import { newLoginIDFieldComponent, LoginIDFieldStateFactory } from "./field/login_id"
import { newPasswordFieldComponent, PasswordFieldStateFactory } from "./field/password"

import { AuthViewFactory, AuthView, AuthComponentSet, AuthState } from "../../auth/view"

export function newAuthViewFactory(): AuthViewFactory {
    return () => {
        return {
            view: new View(new AuthStateFactory().renewCredential()),
            terminate: () => {
                // mock では特に何もしない
            },
        }
    }
}

class AuthStateFactory {
    renewCredential(): AuthState {
        return { type: "renew-credential" }
    }

    passwordLogin(): AuthState {
        return { type: "password-login" }
    }
    passwordResetSession(): AuthState {
        return { type: "password-reset-session" }
    }
    passwordReset(): AuthState {
        return { type: "password-reset" }
    }

    error(err: string): AuthState {
        return { type: "error", err }
    }
}

class View implements AuthView {
    components: AuthComponentSet

    state: AuthState

    constructor(state: AuthState) {
        this.state = state

        this.components = {
            renewCredential: () =>
                components({
                    renewCredential: newRenewCredentialComponent(),
                }),

            passwordLogin: () =>
                components({
                    href: newAppHref(),
                    passwordLogin: newPasswordLoginComponent(),
                    loginIDField: newLoginIDFieldComponent(new LoginIDFieldStateFactory().empty()),
                    passwordField: newPasswordFieldComponent(new PasswordFieldStateFactory().empty()),
                }),
            passwordResetSession: () =>
                components({
                    href: newAppHref(),
                    passwordResetSession: newPasswordResetSessionComponent(),
                    loginIDField: newLoginIDFieldComponent(new LoginIDFieldStateFactory().empty()),
                }),
            passwordReset: () =>
                components({
                    href: newAppHref(),
                    passwordReset: newPasswordResetComponent(),
                    loginIDField: newLoginIDFieldComponent(new LoginIDFieldStateFactory().empty()),
                    passwordField: newPasswordFieldComponent(new PasswordFieldStateFactory().empty()),
                }),
        }

        function components<T>(components: T) {
            return components
        }
    }

    onStateChange(post: Post<AuthState>): void {
        post(this.state)
    }

    load(): void {
        // mock では特に何もしない
    }
}

interface Post<T> {
    (state: T): void
}
