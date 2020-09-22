import { initInputValue } from "../../../field/adapter"

import { PasswordLoginComponent } from "../../../auth/password_login/component"

import { PasswordLoginState, PasswordLoginComponentOperation } from "../../../auth/password_login/data"
import { LoginIDFieldState } from "../../../auth/field/login_id/data"
import { PasswordFieldState } from "../../../auth/field/password/data"

export function newPasswordLoginComponent(): PasswordLoginComponent {
    const init = new Init()
    return new Component(
        init.delayedToLogin(),
        init.loginIDValid(),
        init.passwordValid(),
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

class Component implements PasswordLoginComponent {
    state: PasswordLoginState
    loginID: LoginIDFieldState
    password: PasswordFieldState

    constructor(
        state: PasswordLoginState,
        loginID: LoginIDFieldState,
        password: PasswordFieldState,
    ) {
        this.state = state
        this.loginID = loginID
        this.password = password
    }

    hook(_stateChanged: Publisher<PasswordLoginState>): void {
        // mock では特に何もしない
    }
    init(stateChanged: Publisher<PasswordLoginState>): void {
        stateChanged(this.state)
    }
    initLoginIDField(stateChanged: Publisher<LoginIDFieldState>): void {
        stateChanged(this.loginID)
    }
    initPasswordField(stateChanged: Publisher<PasswordFieldState>): void {
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
