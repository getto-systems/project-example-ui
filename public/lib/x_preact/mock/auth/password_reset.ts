import { PasswordResetComponent } from "../../../auth/password_reset/component"

import { PasswordResetComponentState, PasswordResetComponentOperation } from "../../../auth/password_reset/data"
import { LoginIDFieldComponentState } from "../../../auth/field/login_id/data"
import { PasswordFieldComponentState } from "../../../auth/field/password/data"

import { initInputValue } from "../../../field/data"

export function newPasswordResetComponent(): PasswordResetComponent {
    const init = new Init()
    return new Component(
        init.initialReset(),
        init.loginIDValid(),
        init.passwordValid(),
    )
}

class Init {
    initialReset(): PasswordResetComponentState {
        return { type: "initial-reset" }
    }
    tryToReset(): PasswordResetComponentState {
        return { type: "try-to-reset" }
    }
    delayedToReset(): PasswordResetComponentState {
        return { type: "delayed-to-reset" }
    }
    failedToReset_validation_error(): PasswordResetComponentState {
        return { type: "failed-to-reset", err: { type: "validation-error" } }
    }
    failedToReset_bad_request(): PasswordResetComponentState {
        return { type: "failed-to-reset", err: { type: "bad-request" } }
    }
    failedToReset_invalid_password_reset(): PasswordResetComponentState {
        return { type: "failed-to-reset", err: { type: "invalid-password-reset" } }
    }
    failedToReset_server_error(): PasswordResetComponentState {
        return { type: "failed-to-reset", err: { type: "server-error" } }
    }
    failedToReset_bad_response(): PasswordResetComponentState {
        return { type: "failed-to-reset", err: { type: "bad-response", err: "error" } }
    }
    failedToReset_infra_error(): PasswordResetComponentState {
        return { type: "failed-to-reset", err: { type: "infra-error", err: "error" } }
    }

    loginIDValid(): LoginIDFieldComponentState {
        return { type: "succeed-to-update-login_id", result: { valid: true } }
    }
    loginIDInvalid_empty(): LoginIDFieldComponentState {
        return { type: "succeed-to-update-login_id", result: { valid: false, err: ["empty"] } }
    }

    passwordValid(): PasswordFieldComponentState {
        return {
            type: "succeed-to-update-password",
            result: { valid: true },
            character: { complex: false },
            view: { show: false },
        }
    }
    passwordInvalid_empty(): PasswordFieldComponentState {
        return {
            type: "succeed-to-update-password",
            result: { valid: false, err: ["empty"] },
            character: { complex: false },
            view: { show: false },
        }
    }
    passwordInvalid_too_long(): PasswordFieldComponentState {
        return {
            type: "succeed-to-update-password",
            result: { valid: false, err: ["too-long"] },
            character: { complex: false },
            view: { show: false },
        }
    }
    passwordComplexInvalid_too_long(): PasswordFieldComponentState {
        return {
            type: "succeed-to-update-password",
            result: { valid: false, err: ["too-long"] },
            character: { complex: true },
            view: { show: false },
        }
    }
    passwordComplex(): PasswordFieldComponentState {
        return {
            type: "succeed-to-update-password",
            result: { valid: true },
            character: { complex: true },
            view: { show: false },
        }
    }
    passwordView(): PasswordFieldComponentState {
        return {
            type: "succeed-to-update-password",
            result: { valid: true },
            character: { complex: false },
            view: { show: true, password: initInputValue("password") },
        }
    }
}

class Component implements PasswordResetComponent {
    state: PasswordResetComponentState
    loginID: LoginIDFieldComponentState
    password: PasswordFieldComponentState

    constructor(
        state: PasswordResetComponentState,
        loginID: LoginIDFieldComponentState,
        password: PasswordFieldComponentState,
    ) {
        this.state = state
        this.loginID = loginID
        this.password = password
    }

    hook(_stateChanged: Publisher<PasswordResetComponentState>): void {
        // mock では特に何もしない
    }
    init(stateChanged: Publisher<PasswordResetComponentState>): void {
        stateChanged(this.state)
    }
    initLoginIDField(stateChanged: Publisher<LoginIDFieldComponentState>): void {
        stateChanged(this.loginID)
    }
    initPasswordField(stateChanged: Publisher<PasswordFieldComponentState>): void {
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
