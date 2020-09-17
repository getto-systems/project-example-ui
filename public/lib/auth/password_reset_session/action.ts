import { PasswordResetSessionAction, SessionEventSender, PollingStatusEventSender } from "../../password_reset_session/action"

import { LoginIDFieldComponent } from "../field/login_id/data"

import {
    InputContent,
    CreateSessionError,
    PollingStatusError, PollingStatus, DoneStatus,
} from "../../password_reset_session/data"

export interface PasswordResetSessionComponentAction {
    passwordResetSession: PasswordResetSessionAction
}

export interface PasswordResetSessionComponent {
    loginID: LoginIDFieldComponent

    initialState: PasswordResetSessionComponentState

    createSession(event: PasswordResetSessionComponentEvent): Promise<void>
}

export type PasswordResetSessionComponentState =
    Readonly<{ type: "initial-reset-session" }> |
    Readonly<{ type: "try-to-create-session" }> |
    Readonly<{ type: "delayed-to-create-session" }> |
    Readonly<{ type: "failed-to-create-session", content: InputContent, err: CreateSessionError }> |
    Readonly<{ type: "try-to-polling-status" }> |
    Readonly<{ type: "retry-to-polling-status", status: PollingStatus }> |
    Readonly<{ type: "failed-to-polling-status", err: PollingStatusError }> |
    Readonly<{ type: "succeed-to-send-token", status: DoneStatus }>

export interface PasswordResetSessionComponentEvent extends SessionEventSender, PollingStatusEventSender { }

export interface PasswordResetSessionComponentEventInit {
    (stateChanged: PasswordResetSessionComponentStateHandler): PasswordResetSessionComponentEvent
}

export interface PasswordResetSessionComponentStateHandler {
    (state: PasswordResetSessionComponentState): void
}
