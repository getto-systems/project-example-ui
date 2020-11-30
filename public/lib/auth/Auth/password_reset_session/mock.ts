import { initAuthLink } from "../View/impl/link"

import { AuthLink } from "../link"

import { PasswordResetSessionComponent, PasswordResetSessionState } from "./component"

export function initPasswordResetSession(): PasswordResetSessionComponent {
    return new Component(new PasswordResetSessionStateFactory().succeedToSendToken())
}

class PasswordResetSessionStateFactory {
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
    tryToCheckStatus(): PasswordResetSessionState {
        return { type: "try-to-check-status" }
    }
    retryToCheckStatus_waiting(): PasswordResetSessionState {
        return { type: "retry-to-check-status", dest: { type: "log" }, status: { sending: false } }
    }
    retryToCheckStatus_sending(): PasswordResetSessionState {
        return { type: "retry-to-check-status", dest: { type: "log" }, status: { sending: true } }
    }
    failedToCheckStatus_bad_request(): PasswordResetSessionState {
        return { type: "failed-to-check-status", err: { type: "bad-request" } }
    }
    failedToCheckStatus_invalid_password_reset(): PasswordResetSessionState {
        return { type: "failed-to-check-status", err: { type: "invalid-password-reset" } }
    }
    failedToCheckStatus_server_error(): PasswordResetSessionState {
        return { type: "failed-to-check-status", err: { type: "server-error" } }
    }
    failedToCheckStatus_bad_response(): PasswordResetSessionState {
        return { type: "failed-to-check-status", err: { type: "bad-response", err: "error" } }
    }
    failedToCheckStatus_infra_error(): PasswordResetSessionState {
        return { type: "failed-to-check-status", err: { type: "infra-error", err: "error" } }
    }
    failedToSendToken(): PasswordResetSessionState {
        return {
            type: "failed-to-send-token",
            dest: { type: "log" },
            err: { type: "infra-error", err: "error" },
        }
    }
    succeedToSendToken(): PasswordResetSessionState {
        return { type: "succeed-to-send-token", dest: { type: "log" } }
    }
}

class Component implements PasswordResetSessionComponent {
    state: PasswordResetSessionState
    link: AuthLink

    constructor(state: PasswordResetSessionState) {
        this.state = state
        this.link = initAuthLink()
    }

    onStateChange(post: Post<PasswordResetSessionState>): void {
        post(this.state)
    }
    startSession(): void {
        // mock では特に何もしない
    }
}

interface Post<T> {
    (state: T): void
}
