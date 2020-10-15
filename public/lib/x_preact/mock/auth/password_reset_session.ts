import { newLoginIDFieldComponent, LoginIDFieldInit } from "./field/login_id"

import {
    PasswordResetSessionComponent,
    PasswordResetSessionState,
    PasswordResetSessionFieldComponentSet,
} from "../../../auth/component/password_reset_session/component"

export function newPasswordResetSessionComponent(): PasswordResetSessionComponent {
    return new Component(
        new Init().succeedToSendToken(),
        {
            loginIDField: newLoginIDFieldComponent(new LoginIDFieldInit().noError()),
        },
    )
}

class Init {
    initialResetSession(): PasswordResetSessionState {
        return { type: "initial-reset-session" }
    }
    tryToStartSession(): PasswordResetSessionState {
        return { type: "try-to-start-session" }
    }
    delayedToStartSession(): PasswordResetSessionState {
        return { type: "delayed-to-start-session" }
    }
    failedToStartSession_validation_error(): PasswordResetSessionState {
        return { type: "failed-to-start-session", err: { type: "validation-error" } }
    }
    failedToStartSession_bad_request(): PasswordResetSessionState {
        return { type: "failed-to-start-session", err: { type: "bad-request" } }
    }
    failedToStartSession_invalid_password_reset(): PasswordResetSessionState {
        return { type: "failed-to-start-session", err: { type: "invalid-password-reset" } }
    }
    failedToStartSession_server_error(): PasswordResetSessionState {
        return { type: "failed-to-start-session", err: { type: "server-error" } }
    }
    failedToStartSession_bad_response(): PasswordResetSessionState {
        return { type: "failed-to-start-session", err: { type: "bad-response", err: "error" } }
    }
    failedToStartSession_infra_error(): PasswordResetSessionState {
        return { type: "failed-to-start-session", err: { type: "infra-error", err: "error" } }
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
}

class Component implements PasswordResetSessionComponent {
    state: PasswordResetSessionState
    readonly components: PasswordResetSessionFieldComponentSet

    constructor(state: PasswordResetSessionState, components: PasswordResetSessionFieldComponentSet) {
        this.state = state
        this.components = components
    }

    onStateChange(post: Post<PasswordResetSessionState>): void {
        post(this.state)
    }
    action(): void {
        // mock では特に何もしない
    }
}

interface Post<T> {
    (state: T): void
}
