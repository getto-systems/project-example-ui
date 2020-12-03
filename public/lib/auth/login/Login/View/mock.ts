import { initRenewCredential } from "../renew_credential/mock"

import { initPasswordLogin } from "../password_login/mock"
import { initPasswordResetSession } from "../password_reset_session/mock"
import { initPasswordReset } from "../password_reset/mock"

import { initLoginIDField, LoginIDFieldStateFactory } from "../field/login_id/mock"
import { initPasswordField, PasswordFieldStateFactory } from "../field/password/mock"

import { LoginFactory, LoginView, LoginState } from "./view"

export function newLoginAsMock(): LoginFactory {
    return () => {
        return {
            view: new View(new LoginStateFactory().renewCredential()),
            terminate: () => {
                // mock では特に何もしない
            },
        }
    }
}

class LoginStateFactory {
    renewCredential(): LoginState {
        return {
            type: "renew-credential",
            components: {
                renewCredential: initRenewCredential(),
            },
        }
    }

    passwordLogin(): LoginState {
        return {
            type: "password-login",
            components: {
                passwordLogin: initPasswordLogin(),
                loginIDField: initLoginIDField(new LoginIDFieldStateFactory().empty()),
                passwordField: initPasswordField(new PasswordFieldStateFactory().empty()),
            },
        }
    }
    passwordResetSession(): LoginState {
        return {
            type: "password-reset-session",
            components: {
                passwordResetSession: initPasswordResetSession(),
                loginIDField: initLoginIDField(new LoginIDFieldStateFactory().empty()),
            },
        }
    }
    passwordReset(): LoginState {
        return {
            type: "password-reset",
            components: {
                passwordReset: initPasswordReset(),
                loginIDField: initLoginIDField(new LoginIDFieldStateFactory().empty()),
                passwordField: initPasswordField(new PasswordFieldStateFactory().empty()),
            },
        }
    }

    error(err: string): LoginState {
        return { type: "error", err }
    }
}

class View implements LoginView {
    state: LoginState

    constructor(state: LoginState) {
        this.state = state
    }

    onStateChange(post: Post<LoginState>): void {
        post(this.state)
    }

    load(): void {
        // mock では特に何もしない
    }
}

interface Post<T> {
    (state: T): void
}
