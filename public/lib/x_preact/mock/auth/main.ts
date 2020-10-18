import { newAppHref } from "../../../main/href"

import { newRenewCredentialComponent } from "./renew_credential"

import { newPasswordLoginComponent } from "./password_login"
import { newPasswordResetSessionComponent } from "./password_reset_session"
import { newPasswordResetComponent } from "./password_reset"

import { newLoginIDFieldComponent, LoginIDFieldInit } from "./field/login_id"
import { newPasswordFieldComponent, PasswordFieldInit } from "./field/password"

import {
    AuthInit,
    AuthView,
    AuthComponentSet,
    AuthState,
} from "../../../auth/view"

export function newAuthInit(): AuthInit {
    return () => {
        return {
            view: new View(new Init().renewCredential()),
            terminate: () => {
                // mock では特に何もしない
            },
        }
    }
}

class Init {
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
            renewCredential: () => components({
                renewCredential: newRenewCredentialComponent(),
            }),

            passwordLogin: () => components({
                href: newAppHref(),
                passwordLogin: newPasswordLoginComponent(),
                loginIDField: newLoginIDFieldComponent(new LoginIDFieldInit().empty()),
                passwordField: newPasswordFieldComponent(new PasswordFieldInit().empty()),
            }),
            passwordResetSession: () => components({
                href: newAppHref(),
                passwordResetSession: newPasswordResetSessionComponent(),
                loginIDField: newLoginIDFieldComponent(new LoginIDFieldInit().empty()),
            }),
            passwordReset: () => components({
                href: newAppHref(),
                passwordReset: newPasswordResetComponent(),
                loginIDField: newLoginIDFieldComponent(new LoginIDFieldInit().empty()),
                passwordField: newPasswordFieldComponent(new PasswordFieldInit().empty()),
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
