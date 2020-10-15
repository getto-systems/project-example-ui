import { newLoginIDFieldComponent, LoginIDFieldInit } from "./field/login_id"
import { newPasswordFieldComponent, PasswordFieldInit } from "./field/password"

import {
    PasswordResetComponent,
    PasswordResetState,
    PasswordResetFieldComponentSet,
} from "../../../auth/component/password_reset/component"

export function newPasswordResetComponent(): PasswordResetComponent {
    return new Component(
        new Init().initialReset(),
        {
            loginIDField: newLoginIDFieldComponent(new LoginIDFieldInit().noError()),
            passwordField: newPasswordFieldComponent(new PasswordFieldInit().noError()),
        },
    )
}

class Init {
    initialReset(): PasswordResetState {
        return { type: "initial-reset" }
    }
    tryToReset(): PasswordResetState {
        return { type: "try-to-reset" }
    }
    delayedToReset(): PasswordResetState {
        return { type: "delayed-to-reset" }
    }
    failedToReset_validation_error(): PasswordResetState {
        return { type: "failed-to-reset", err: { type: "validation-error" } }
    }
    failedToReset_bad_request(): PasswordResetState {
        return { type: "failed-to-reset", err: { type: "bad-request" } }
    }
    failedToReset_invalid_password_reset(): PasswordResetState {
        return { type: "failed-to-reset", err: { type: "invalid-password-reset" } }
    }
    failedToReset_server_error(): PasswordResetState {
        return { type: "failed-to-reset", err: { type: "server-error" } }
    }
    failedToReset_bad_response(): PasswordResetState {
        return { type: "failed-to-reset", err: { type: "bad-response", err: "error" } }
    }
    failedToReset_infra_error(): PasswordResetState {
        return { type: "failed-to-reset", err: { type: "infra-error", err: "error" } }
    }
}

class Component implements PasswordResetComponent {
    state: PasswordResetState
    readonly components: PasswordResetFieldComponentSet

    constructor(state: PasswordResetState, components: PasswordResetFieldComponentSet) {
        this.state = state
        this.components = components
    }

    onStateChange(post: Post<PasswordResetState>): void {
        post(this.state)
    }
    action(): void {
        // mock では特に何もしない
    }
}

interface Post<T> {
    (state: T): void
}
