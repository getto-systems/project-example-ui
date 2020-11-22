import {
    PasswordLoginComponent,
    PasswordLoginState,
} from "../../auth/component/password_login/component"

export function newPasswordLoginComponent(): PasswordLoginComponent {
    return new Component(new PasswordLoginStateFactory().initialLogin())
}

class PasswordLoginStateFactory {
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

    constructor(state: PasswordLoginState) {
        this.state = state
    }

    onStateChange(post: Post<PasswordLoginState>): void {
        post(this.state)
    }
    login(): void {
        // mock では特に何もしない
    }
    loadError(): void {
        // mock では特に何もしない
    }
}

interface Post<T> {
    (state: T): void
}
