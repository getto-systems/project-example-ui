import { PasswordResetSessionComponent } from "../../../auth/password_reset_session/component"

import {
    PasswordResetSessionState,
    PasswordResetSessionComponentOperation,
} from "../../../auth/password_reset_session/data"
import { LoginIDFieldState } from "../../../auth/field/login_id/data"

export function newPasswordResetSessionComponent(): PasswordResetSessionComponent {
    const init = new Init()
    return new Component(
        init.initialResetSession(),
        init.loginIDValid(),
    )
}

class Init {
    initialResetSession(): PasswordResetSessionState {
        return { type: "initial-reset-session" }
    }
    tryToCreateSession(): PasswordResetSessionState {
        return { type: "try-to-create-session" }
    }
    delayedToCreateSession(): PasswordResetSessionState {
        return { type: "delayed-to-create-session" }
    }
    failedToCreateSession_validation_error(): PasswordResetSessionState {
        return { type: "failed-to-create-session", err: { type: "validation-error" } }
    }
    failedToCreateSession_bad_request(): PasswordResetSessionState {
        return { type: "failed-to-create-session", err: { type: "bad-request" } }
    }
    failedToCreateSession_invalid_password_reset(): PasswordResetSessionState {
        return { type: "failed-to-create-session", err: { type: "invalid-password-reset" } }
    }
    failedToCreateSession_server_error(): PasswordResetSessionState {
        return { type: "failed-to-create-session", err: { type: "server-error" } }
    }
    failedToCreateSession_bad_response(): PasswordResetSessionState {
        return { type: "failed-to-create-session", err: { type: "bad-response", err: "error" } }
    }
    failedToCreateSession_infra_error(): PasswordResetSessionState {
        return { type: "failed-to-create-session", err: { type: "infra-error", err: "error" } }
    }
    tryToPollingStatus(): PasswordResetSessionState {
        return { type: "try-to-polling-status" }
    }
    retryToPollingStatus_waiting(): PasswordResetSessionState {
        return { type: "retry-to-polling-status", dest: { type: "log" }, status: { sending: false } }
    }
    retryToPollingStatus_sending(): PasswordResetSessionState {
        return { type: "retry-to-polling-status", dest: { type: "log" }, status: { sending: true } }
    }
    failedToPollingStatus_bad_request(): PasswordResetSessionState {
        return { type: "failed-to-polling-status", err: { type: "bad-request" } }
    }
    failedToPollingStatus_invalid_password_reset(): PasswordResetSessionState {
        return { type: "failed-to-polling-status", err: { type: "invalid-password-reset" } }
    }
    failedToPollingStatus_server_error(): PasswordResetSessionState {
        return { type: "failed-to-polling-status", err: { type: "server-error" } }
    }
    failedToPollingStatus_bad_response(): PasswordResetSessionState {
        return { type: "failed-to-polling-status", err: { type: "bad-response", err: "error" } }
    }
    failedToPollingStatus_infra_error(): PasswordResetSessionState {
        return { type: "failed-to-polling-status", err: { type: "infra-error", err: "error" } }
    }
    failedToSendToken(): PasswordResetSessionState {
        return { type: "failed-to-send-token", dest: { type: "log" }, err: { type: "infra-error", err: "error" } }
    }
    succeedToSendToken(): PasswordResetSessionState {
        return { type: "succeed-to-send-token", dest: { type: "log" } }
    }

    loginIDValid(): LoginIDFieldState {
        return { type: "succeed-to-update-login_id", result: { valid: true } }
    }
    loginIDInvalid_empty(): LoginIDFieldState {
        return { type: "succeed-to-update-login_id", result: { valid: false, err: ["empty"] } }
    }
}

class Component implements PasswordResetSessionComponent {
    state: PasswordResetSessionState
    loginID: LoginIDFieldState

    constructor(
        state: PasswordResetSessionState,
        loginID: LoginIDFieldState,
    ) {
        this.state = state
        this.loginID = loginID
    }

    hook(_stateChanged: Publisher<PasswordResetSessionState>): void {
        // mock では特に何もしない
    }
    onStateChange(stateChanged: Publisher<PasswordResetSessionState>): void {
        stateChanged(this.state)
    }
    onLoginIDFieldStateChange(stateChanged: Publisher<LoginIDFieldState>): void {
        stateChanged(this.loginID)
    }
    terminate(): void {
        // mock では特に何もしない
    }
    trigger(operation: PasswordResetSessionComponentOperation): Promise<void> {
        switch (operation.type) {
            case "create-session":
                alert("ここでセッションを作成！")
                return Promise.resolve()

            case "field-login_id":
                // field のイベントは特にフィードバックしない
                return Promise.resolve()
        }
    }
}

interface Publisher<T> {
    (state: T): void
}
