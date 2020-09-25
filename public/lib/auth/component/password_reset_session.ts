import { LoginIDFieldState } from "./field/login_id"

import { PasswordResetAction } from "../../password_reset/action"
import { LoginIDFieldAction } from "../../field/login_id/action"

import { Destination, PollingStatus, StartSessionError, PollingStatusError, SendTokenError } from "../../password_reset/data"
import { LoginIDFieldOperation } from "../../field/login_id/data"

export interface PasswordResetSessionComponent {
    onStateChange(stateChanged: Post<PasswordResetSessionState>): void
    onLoginIDFieldStateChange(stateChanged: Post<LoginIDFieldState>): void
    terminate(): void
    trigger(operation: PasswordResetSessionComponentOperation): Promise<void>
}

export type PasswordResetSessionState =
    Readonly<{ type: "initial-reset-session" }> |
    Readonly<{ type: "try-to-start-session" }> |
    Readonly<{ type: "delayed-to-start-session" }> |
    Readonly<{ type: "failed-to-start-session", err: StartSessionError }> |
    Readonly<{ type: "try-to-polling-status" }> |
    Readonly<{ type: "retry-to-polling-status", dest: Destination, status: PollingStatus }> |
    Readonly<{ type: "failed-to-polling-status", err: PollingStatusError }> |
    Readonly<{ type: "failed-to-send-token", dest: Destination, err: SendTokenError }> |
    Readonly<{ type: "succeed-to-send-token", dest: Destination }>

export const initialPasswordResetSessionState: PasswordResetSessionState = { type: "initial-reset-session" }

export type PasswordResetSessionComponentOperation =
    Readonly<{ type: "start-session" }> |
    Readonly<{ type: "field-login_id", operation: LoginIDFieldOperation }>

export interface PasswordResetSessionWorkerComponentHelper {
    mapPasswordResetSessionState(state: PasswordResetSessionState): PasswordResetSessionWorkerState
    mapLoginIDFieldState(state: LoginIDFieldState): PasswordResetSessionWorkerState
}

export type PasswordResetSessionWorkerState =
    Readonly<{ type: "password_login", state: PasswordResetSessionState }> |
    Readonly<{ type: "field-login_id", state: LoginIDFieldState }>

export interface PasswordResetSessionComponentAction {
    passwordReset: PasswordResetAction
    loginIDField: LoginIDFieldAction
}

interface Post<T> {
    (state: T): void
}
