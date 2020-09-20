import { PasswordResetSessionComponent } from "../../../auth/password_reset_session/component"

import {
    PasswordResetSessionComponentState,
    PasswordResetSessionComponentOperation,
} from "../../../auth/password_reset_session/data"
import { LoginIDFieldComponentState } from "../../../auth/field/login_id/data"

export function newPasswordResetSessionComponent(): PasswordResetSessionComponent {
    const init = new Init()
    return new Component(
        init.initialResetSession(),
        init.loginIDValid(),
    )
}

class Init {
    initialResetSession(): PasswordResetSessionComponentState {
        return { type: "initial-reset-session" }
    }
    tryToCreateSession(): PasswordResetSessionComponentState {
        return { type: "try-to-create-session" }
    }
    delayedToCreateSession(): PasswordResetSessionComponentState {
        return { type: "delayed-to-create-session" }
    }
    failedToCreateSession_validation_error(): PasswordResetSessionComponentState {
        return { type: "failed-to-create-session", err: { type: "validation-error" } }
    }
    failedToCreateSession_bad_request(): PasswordResetSessionComponentState {
        return { type: "failed-to-create-session", err: { type: "bad-request" } }
    }
    failedToCreateSession_invalid_password_reset(): PasswordResetSessionComponentState {
        return { type: "failed-to-create-session", err: { type: "invalid-password-reset" } }
    }
    failedToCreateSession_server_error(): PasswordResetSessionComponentState {
        return { type: "failed-to-create-session", err: { type: "server-error" } }
    }
    failedToCreateSession_bad_response(): PasswordResetSessionComponentState {
        return { type: "failed-to-create-session", err: { type: "bad-response", err: "error" } }
    }
    failedToCreateSession_infra_error(): PasswordResetSessionComponentState {
        return { type: "failed-to-create-session", err: { type: "infra-error", err: "error" } }
    }
    tryToPollingStatus(): PasswordResetSessionComponentState {
        return { type: "try-to-polling-status" }
    }
    retryToPollingStatus_waiting(): PasswordResetSessionComponentState {
        return { type: "retry-to-polling-status", status: { sending: false, since: "" } }
    }
    retryToPollingStatus_sending(): PasswordResetSessionComponentState {
        return { type: "retry-to-polling-status", status: { sending: true, since: "" } }
    }
    failedToPollingStatus_bad_request(): PasswordResetSessionComponentState {
        return { type: "failed-to-polling-status", err: { type: "bad-request" } }
    }
    failedToPollingStatus_invalid_password_reset(): PasswordResetSessionComponentState {
        return { type: "failed-to-polling-status", err: { type: "invalid-password-reset" } }
    }
    failedToPollingStatus_server_error(): PasswordResetSessionComponentState {
        return { type: "failed-to-polling-status", err: { type: "server-error" } }
    }
    failedToPollingStatus_bad_response(): PasswordResetSessionComponentState {
        return { type: "failed-to-polling-status", err: { type: "bad-response", err: "error" } }
    }
    failedToPollingStatus_infra_error(): PasswordResetSessionComponentState {
        return { type: "failed-to-polling-status", err: { type: "infra-error", err: "error" } }
    }
    succeedToSendToken_success(): PasswordResetSessionComponentState {
        return { type: "succeed-to-send-token", status: { success: true, at: "" } }
    }
    succeedToSendToken_failed(): PasswordResetSessionComponentState {
        // TODO これは failed-to-send-token にするべきかな
        return { type: "succeed-to-send-token", status: { success: false, at: "" } }
    }

    loginIDValid(): LoginIDFieldComponentState {
        return { type: "succeed-to-update-login_id", result: { valid: true } }
    }
    loginIDInvalid_empty(): LoginIDFieldComponentState {
        return { type: "succeed-to-update-login_id", result: { valid: false, err: ["empty"] } }
    }
}

class Component implements PasswordResetSessionComponent {
    state: PasswordResetSessionComponentState
    loginID: LoginIDFieldComponentState

    constructor(
        state: PasswordResetSessionComponentState,
        loginID: LoginIDFieldComponentState,
    ) {
        this.state = state
        this.loginID = loginID
    }

    hook(_stateChanged: Publisher<PasswordResetSessionComponentState>): void {
        // mock では特に何もしない
    }
    init(stateChanged: Publisher<PasswordResetSessionComponentState>): void {
        stateChanged(this.state)
    }
    initLoginIDField(stateChanged: Publisher<LoginIDFieldComponentState>): void {
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
