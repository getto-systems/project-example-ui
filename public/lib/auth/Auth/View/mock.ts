import { initRenewCredential } from "../renew_credential/mock"

import { initPasswordLogin } from "../password_login/mock"
import { initPasswordResetSession } from "../password_reset_session/mock"
import { initPasswordReset } from "../password_reset/mock"

import { initLoginIDField, LoginIDFieldStateFactory } from "../field/login_id/mock"
import { initPasswordField, PasswordFieldStateFactory } from "../field/password/mock"

import { AuthFactory, AuthView, AuthState } from "./view"

export function newAuthAsMock(): AuthFactory {
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
        return {
            type: "renew-credential",
            components: {
                renewCredential: initRenewCredential(),
            },
        }
    }

    passwordLogin(): AuthState {
        return {
            type: "password-login",
            components: {
                passwordLogin: initPasswordLogin(),
                loginIDField: initLoginIDField(new LoginIDFieldStateFactory().empty()),
                passwordField: initPasswordField(new PasswordFieldStateFactory().empty()),
            },
        }
    }
    passwordResetSession(): AuthState {
        return {
            type: "password-reset-session",
            components: {
                passwordResetSession: initPasswordResetSession(),
                loginIDField: initLoginIDField(new LoginIDFieldStateFactory().empty()),
            },
        }
    }
    passwordReset(): AuthState {
        return {
            type: "password-reset",
            components: {
                passwordReset: initPasswordReset(),
                loginIDField: initLoginIDField(new LoginIDFieldStateFactory().empty()),
                passwordField: initPasswordField(new PasswordFieldStateFactory().empty()),
            },
        }
    }

    error(err: string): AuthState {
        return { type: "error", err }
    }
}

class View implements AuthView {
    state: AuthState

    constructor(state: AuthState) {
        this.state = state
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
