import { packInputValue } from "../../../field/adapter"

import {
    PasswordLoginComponent,
    PasswordLoginComponentResource,
    PasswordLoginState,
} from "../../../auth/component/password_login/component"

import { LoginIDFieldState } from "../../../auth/component/field/login_id/component"
import { PasswordFieldState } from "../../../auth/component/field/password/component"

import { noError, hasError } from "../../../field/data"
import { simplePassword, complexPassword, hidePassword, showPassword } from "../../../password/field/data"

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
        return { type: "succeed-to-update-login_id", result: noError() }
    }
    loginIDInvalid_empty(): LoginIDFieldState {
        return { type: "succeed-to-update-login_id", result: hasError(["empty"]) }
    }

    passwordValid(): PasswordFieldState {
        return {
            type: "succeed-to-update-password",
            result: noError(),
            character: simplePassword,
            view: hidePassword,
        }
    }
    passwordInvalid_empty(): PasswordFieldState {
        return {
            type: "succeed-to-update-password",
            result: hasError(["empty"]),
            character: simplePassword,
            view: hidePassword,
        }
    }
    passwordInvalid_too_long(): PasswordFieldState {
        return {
            type: "succeed-to-update-password",
            result: hasError(["too-long"]),
            character: simplePassword,
            view: hidePassword,
        }
    }
    passwordComplexInvalid_too_long(): PasswordFieldState {
        return {
            type: "succeed-to-update-password",
            result: hasError(["too-long"]),
            character: complexPassword,
            view: hidePassword,
        }
    }
    passwordComplex(): PasswordFieldState {
        return {
            type: "succeed-to-update-password",
            result: noError(),
            character: complexPassword,
            view: hidePassword,
        }
    }
    passwordView(): PasswordFieldState {
        return {
            type: "succeed-to-update-password",
            result: noError(),
            character: simplePassword,
            view: showPassword(packInputValue("password")),
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

    init(): PasswordLoginComponentResource {
        return {
            request: operation => {
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
            },
            terminate: () => { /* mock では特に何もしない */ },
        }
    }
}

interface Post<T> {
    (state: T): void
}
