import { LoginIDFieldComponentState } from "../field/login_id/data"

import { PasswordResetSessionAction } from "../../password_reset_session/action"
import { LoginIDFieldAction } from "../../field/login_id/action"

import { LoginIDFieldOperation } from "../../field/login_id/data"

import {
    InputContent,
    CreateSessionError,
    PollingStatusError, PollingStatus, DoneStatus,
} from "../../password_reset_session/data"

export interface PasswordResetSessionComponentAction {
    passwordResetSession: PasswordResetSessionAction
    loginIDField: LoginIDFieldAction
}

export interface PasswordResetSessionComponent {
    init(stateChanged: Publisher<PasswordResetSessionComponentState>): void
    initLoginIDField(stateChanged: Publisher<LoginIDFieldComponentState>): void
    terminate(): void
    trigger(operation: PasswordResetSessionComponentOperation): Promise<void>
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

export const initialPasswordResetSessionComponentState: PasswordResetSessionComponentState = { type: "initial-reset-session" }

export type PasswordResetSessionComponentOperation =
    Readonly<{ type: "create-session" }> |
    Readonly<{ type: "field-login_id", operation: LoginIDFieldOperation }>

export interface PasswordResetSessionWorkerComponentHelper {
    mapPasswordResetSessionComponentState(state: PasswordResetSessionComponentState): PasswordResetSessionWorkerComponentState
    mapLoginIDFieldComponentState(state: LoginIDFieldComponentState): PasswordResetSessionWorkerComponentState
}

export type PasswordResetSessionWorkerComponentState =
    Readonly<{ type: "password_login", state: PasswordResetSessionComponentState }> |
    Readonly<{ type: "field-login_id", state: LoginIDFieldComponentState }>

interface Publisher<T> {
    (state: T): void
}
