import { newLoginIDFieldComponent, LoginIDFieldInit } from "./field/login_id"
import { newPasswordFieldComponent, PasswordFieldInit } from "./field/password"

import {
    PasswordLoginComponent,
    PasswordLoginState,
    PasswordLoginFieldComponentSet,
} from "../../../auth/component/password_login/component"

export function newPasswordLoginComponent(): PasswordLoginComponent {
    return new Component(
        new Init().initialLogin(),
        {
            loginID: { loginIDField: newLoginIDFieldComponent(new LoginIDFieldInit().noError()) },
            password: { passwordField: newPasswordFieldComponent(new PasswordFieldInit().noError()) },
        },
    )
}

class Init {
    initialLogin(): PasswordLoginState {
        return { type: "initial-login" }
    }
    tryToLogin(): PasswordLoginState {
        return { type: "try-to-login" }
    }
    delayedToLogin(): PasswordLoginState {
        return { type: "delayed-to-login" }
    }
    failedToLogin_validation_error(): PasswordLoginState {
        return { type: "failed-to-login", err: { type: "validation-error" } }
    }
    failedToLogin_bad_request(): PasswordLoginState {
        return { type: "failed-to-login", err: { type: "bad-request" } }
    }
    failedToLogin_invalid_password_login(): PasswordLoginState {
        return { type: "failed-to-login", err: { type: "invalid-password-login" } }
    }
    failedToLogin_server_error(): PasswordLoginState {
        return { type: "failed-to-login", err: { type: "server-error" } }
    }
    failedToLogin_bad_response(): PasswordLoginState {
        return { type: "failed-to-login", err: { type: "bad-response", err: "error" } }
    }
    failedToLogin_infra_error(): PasswordLoginState {
        return { type: "failed-to-login", err: { type: "infra-error", err: "error" } }
    }
}

class Component implements PasswordLoginComponent {
    state: PasswordLoginState
    readonly components: PasswordLoginFieldComponentSet

    constructor(state: PasswordLoginState, components: PasswordLoginFieldComponentSet) {
        this.state = state
        this.components = components
    }

    onStateChange(post: Post<PasswordLoginState>): void {
        post(this.state)
    }
    action(): void {
        // mock では特に何もしない
    }
}

interface Post<T> {
    (state: T): void
}
