import { initInputValue } from "../../../field/adapter"

import { PasswordLoginComponent } from "../../../auth/password_login/component"

import { PasswordLoginComponentState, PasswordLoginComponentOperation } from "../../../auth/password_login/data"
import { LoginIDFieldComponentState } from "../../../auth/field/login_id/data"
import { PasswordFieldComponentState } from "../../../auth/field/password/data"

export function newPasswordLoginComponent(): PasswordLoginComponent {
    const init = new Init()
    return new Component(
        init.delayedToLogin(),
        init.loginIDValid(),
        init.passwordValid(),
    )
}

class Init {
    initialLogin(): PasswordLoginComponentState {
        return { type: "initial-login" }
    }
    tryToLogin(): PasswordLoginComponentState {
        return { type: "try-to-login" }
    }
    delayedToLogin(): PasswordLoginComponentState {
        return { type: "delayed-to-login" }
    }
    failedToLogin_validation_error(): PasswordLoginComponentState {
        return { type: "failed-to-login", err: { type: "validation-error" } }
    }
    failedToLogin_bad_request(): PasswordLoginComponentState {
        return { type: "failed-to-login", err: { type: "bad-request" } }
    }
    failedToLogin_invalid_password_login(): PasswordLoginComponentState {
        return { type: "failed-to-login", err: { type: "invalid-password-login" } }
    }
    failedToLogin_server_error(): PasswordLoginComponentState {
        return { type: "failed-to-login", err: { type: "server-error" } }
    }
    failedToLogin_bad_response(): PasswordLoginComponentState {
        return { type: "failed-to-login", err: { type: "bad-response", err: "error" } }
    }
    failedToLogin_infra_error(): PasswordLoginComponentState {
        return { type: "failed-to-login", err: { type: "infra-error", err: "error" } }
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

class Component implements PasswordLoginComponent {
    state: PasswordLoginComponentState
    loginID: LoginIDFieldComponentState
    password: PasswordFieldComponentState

    constructor(
        state: PasswordLoginComponentState,
        loginID: LoginIDFieldComponentState,
        password: PasswordFieldComponentState,
    ) {
        this.state = state
        this.loginID = loginID
        this.password = password
    }

    hook(_stateChanged: Publisher<PasswordLoginComponentState>): void {
        // mock では特に何もしない
    }
    init(stateChanged: Publisher<PasswordLoginComponentState>): void {
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
    trigger(operation: PasswordLoginComponentOperation): Promise<void> {
        switch (operation.type) {
            case "login":
                alert("ここでログイン！")
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
