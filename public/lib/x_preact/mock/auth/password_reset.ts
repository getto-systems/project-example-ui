import { packInputValue } from "../../../field/adapter"

import {
    PasswordResetComponent,
    PasswordResetComponentResource,
    PasswordResetState,
} from "../../../auth/component/password_reset/component"

import { LoginIDFieldState } from "../../../auth/component/field/login_id/component"
import { PasswordFieldState } from "../../../auth/component/field/password/component"

import { noError, hasError } from "../../../field/data"
import { simplePassword, complexPassword, hidePassword, showPassword } from "../../../password/field/data"

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

    onStateChange(stateChanged: Post<PasswordResetState>): void {
        stateChanged(this.state)
    }
    onLoginIDFieldStateChange(stateChanged: Post<LoginIDFieldState>): void {
        stateChanged(this.loginID)
    }
    onPasswordFieldStateChange(stateChanged: Post<PasswordFieldState>): void {
        stateChanged(this.password)
    }

    init(): PasswordResetComponentResource {
        return {
            request: operation => {
                switch (operation.type) {
                    case "reset":
                        alert("ここでリセット！")
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
