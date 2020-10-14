import { newAppHref } from "../../../main/href"

import { newCredentialComponent } from "./credential"

import { newPasswordLoginComponent } from "./password_login"
import { newPasswordResetSessionComponent } from "./password_reset_session"
import { newPasswordResetComponent } from "./password_reset"

import {
    AuthInit,
    AuthView,
    AuthComponentSet,
    AuthState,
} from "../../../auth/view"

export function newAuthInit(): AuthInit {
    return () => {
        return {
            view: new View(new Init().credential()),
            terminate: () => {
                // mock では特に何もしない
            },
        }
    }
}

class Init {
    credential(): AuthState {
        return { type: "credential" }
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
            credential: () => components({
                credential: newCredentialComponent(),
            }),

            passwordLogin: () => components({
                href: newAppHref(),
                passwordLogin: newPasswordLoginComponent(),
            }),
            passwordResetSession: () => components({
                href: newAppHref(),
                passwordResetSession: newPasswordResetSessionComponent(),
            }),
            passwordReset: () => components({
                href: newAppHref(),
                passwordReset: newPasswordResetComponent(),
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
