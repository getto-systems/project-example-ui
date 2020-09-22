import { initInputValue } from "../../../field/adapter"

import { PasswordResetComponent } from "../../../auth/password_reset/component"

import { PasswordResetState, PasswordResetComponentOperation } from "../../../auth/password_reset/data"
import { LoginIDFieldState } from "../../../auth/field/login_id/data"
import { PasswordFieldState } from "../../../auth/field/password/data"

export function newPasswordResetComponent(): PasswordResetComponent {
    const init = new Init()
    return new Component(
        init.initialReset(),
        init.loginIDValid(),
        init.passwordValid(),
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

    loginIDValid(): LoginIDFieldState {
        return { type: "succeed-to-update-login_id", result: { valid: true } }
    }
    loginIDInvalid_empty(): LoginIDFieldState {
        return { type: "succeed-to-update-login_id", result: { valid: false, err: ["empty"] } }
    }

    passwordValid(): PasswordFieldState {
        return {
            type: "succeed-to-update-password",
            result: { valid: true },
            character: { complex: false },
            view: { show: false },
        }
    }
    passwordInvalid_empty(): PasswordFieldState {
        return {
            type: "succeed-to-update-password",
            result: { valid: false, err: ["empty"] },
            character: { complex: false },
            view: { show: false },
        }
    }
    passwordInvalid_too_long(): PasswordFieldState {
        return {
            type: "succeed-to-update-password",
            result: { valid: false, err: ["too-long"] },
            character: { complex: false },
            view: { show: false },
        }
    }
    passwordComplexInvalid_too_long(): PasswordFieldState {
        return {
            type: "succeed-to-update-password",
            result: { valid: false, err: ["too-long"] },
            character: { complex: true },
            view: { show: false },
        }
    }
    passwordComplex(): PasswordFieldState {
        return {
            type: "succeed-to-update-password",
            result: { valid: true },
            character: { complex: true },
            view: { show: false },
        }
    }
    passwordView(): PasswordFieldState {
        return {
            type: "succeed-to-update-password",
            result: { valid: true },
            character: { complex: false },
            view: { show: true, password: initInputValue("password") },
        }
    }
}

class Component implements PasswordResetComponent {
    state: PasswordResetState
    loginID: LoginIDFieldState
    password: PasswordFieldState

    constructor(
        state: PasswordResetState,
        loginID: LoginIDFieldState,
        password: PasswordFieldState,
    ) {
        this.state = state
        this.loginID = loginID
        this.password = password
    }

    hook(_stateChanged: Publisher<PasswordResetState>): void {
        // mock では特に何もしない
    }
    onStateChange(stateChanged: Publisher<PasswordResetState>): void {
        stateChanged(this.state)
    }
    onLoginIDFieldStateChange(stateChanged: Publisher<LoginIDFieldState>): void {
        stateChanged(this.loginID)
    }
    onPasswordFieldStateChange(stateChanged: Publisher<PasswordFieldState>): void {
        stateChanged(this.password)
    }
    terminate(): void {
        // mock では特に何もしない
    }
    trigger(operation: PasswordResetComponentOperation): Promise<void> {
        switch (operation.type) {
            case "reset":
                alert("ここでリセット！")
                return Promise.resolve()

            case "field-login_id":
                // field のイベントは特にフィードバックしない
                return Promise.resolve()

            case "field-password":
                // field のイベントは特にフィードバックしない
                return Promise.resolve()
        }
    }
}

interface Publisher<T> {
    (state: T): void
}
