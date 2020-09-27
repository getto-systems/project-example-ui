import { packInputValue } from "../../../field/adapter"

import {
    PasswordLoginComponent,
    PasswordLoginState,
    PasswordLoginComponentOperation,
} from "../../../auth/component/password_login/component"

import { LoginIDFieldState } from "../../../auth/component/field/login_id/component"
import { PasswordFieldState } from "../../../auth/component/field/password/component"

export function newPasswordLoginComponent(): PasswordLoginComponent {
    const init = new Init()
    return new Component(
        init.initialLogin(),
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
        return { type: "succeed-to-update-login_id", inputValue: packInputValue(""), result: { valid: true } }
    }
    loginIDInvalid_empty(): LoginIDFieldState {
        return { type: "succeed-to-update-login_id", inputValue: packInputValue(""), result: { valid: false, err: ["empty"] } }
    }

    passwordValid(): PasswordFieldState {
        return {
            type: "succeed-to-update-password",
            inputValue: packInputValue(""),
            result: { valid: true },
            character: { complex: false },
            view: { show: false },
        }
    }
    passwordInvalid_empty(): PasswordFieldState {
        return {
            type: "succeed-to-update-password",
            inputValue: packInputValue(""),
            result: { valid: false, err: ["empty"] },
            character: { complex: false },
            view: { show: false },
        }
    }
    passwordInvalid_too_long(): PasswordFieldState {
        return {
            type: "succeed-to-update-password",
            inputValue: packInputValue(""),
            result: { valid: false, err: ["too-long"] },
            character: { complex: false },
            view: { show: false },
        }
    }
    passwordComplexInvalid_too_long(): PasswordFieldState {
        return {
            type: "succeed-to-update-password",
            inputValue: packInputValue(""),
            result: { valid: false, err: ["too-long"] },
            character: { complex: true },
            view: { show: false },
        }
    }
    passwordComplex(): PasswordFieldState {
        return {
            type: "succeed-to-update-password",
            inputValue: packInputValue(""),
            result: { valid: true },
            character: { complex: true },
            view: { show: false },
        }
    }
    passwordView(): PasswordFieldState {
        return {
            type: "succeed-to-update-password",
            inputValue: packInputValue(""),
            result: { valid: true },
            character: { complex: false },
            view: { show: true, password: packInputValue("password") },
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

    onStateChange(stateChanged: Post<PasswordLoginState>): void {
        stateChanged(this.state)
    }
    onLoginIDFieldStateChange(stateChanged: Post<LoginIDFieldState>): void {
        stateChanged(this.loginID)
    }
    onPasswordFieldStateChange(stateChanged: Post<PasswordFieldState>): void {
        stateChanged(this.password)
    }

    init(): Terminate {
        return () => this.terminate()
    }
    terminate(): void {
        // mock では特に何もしない
    }

    async trigger(operation: PasswordLoginComponentOperation): Promise<void> {
        switch (operation.type) {
            case "login":
                alert("ここでログイン！")
                return

            case "field-login_id":
                // field のイベントは特にフィードバックしない
                return

            case "field-password":
                // field のイベントは特にフィードバックしない
                return
        }
    }
}

interface Post<T> {
    (state: T): void
}

interface Terminate {
    (): void
}
