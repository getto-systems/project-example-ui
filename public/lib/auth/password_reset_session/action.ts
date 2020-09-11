import { LoginIDFieldComponent } from "../field/login_id/action"

import { PasswordResetSessionAction, SessionEvent, PollingStatusEvent } from "../../password_reset_session/action"

import {
    InputContent,
    SessionError,
    PollingStatusError, PollingStatus, DoneStatus,
} from "../../password_reset_session/data"

export interface PasswordResetSessionComponentAction {
    passwordResetSession: PasswordResetSessionAction
}

export interface PasswordResetSessionComponent {
    loginID: LoginIDFieldComponent

    initialState: PasswordResetSessionComponentState

    onStateChange(stateChanged: PasswordResetSessionComponentStateHandler): void

    createSession(): Promise<void>
}

export interface PasswordResetSessionComponentEvent extends SessionEvent, PollingStatusEvent { }

export type PasswordResetSessionComponentState =
    Readonly<{ type: "initial-reset-session" }> |
    Readonly<{ type: "try-to-create-session" }> |
    Readonly<{ type: "delayed-to-create-session" }> |
    Readonly<{ type: "failed-to-create-session", content: InputContent, err: SessionError }> |
    Readonly<{ type: "try-to-polling-status" }> |
    Readonly<{ type: "retry-to-polling-status", status: PollingStatus }> |
    Readonly<{ type: "failed-to-polling-status", err: PollingStatusError }> |
    Readonly<{ type: "succeed-to-send-token", status: DoneStatus }>

export interface PasswordResetSessionComponentStateHandler {
    (state: PasswordResetSessionComponentState): void
}
