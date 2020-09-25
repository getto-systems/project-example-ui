import {
    PasswordResetSessionState,
    PasswordResetSessionComponentOperation,
    PasswordResetSessionWorkerState,
} from "./data"

import { LoginIDFieldState } from "../field/login_id/data"

import { PasswordResetAction } from "../../../password_reset/action"
import { LoginIDFieldAction } from "../../../field/login_id/action"

export interface PasswordResetSessionComponentAction {
    passwordReset: PasswordResetAction
    loginIDField: LoginIDFieldAction
}

export interface PasswordResetSessionComponent {
    onStateChange(stateChanged: Post<PasswordResetSessionState>): void
    onLoginIDFieldStateChange(stateChanged: Post<LoginIDFieldState>): void
    terminate(): void
    trigger(operation: PasswordResetSessionComponentOperation): Promise<void>
}

export interface PasswordResetSessionWorkerComponentHelper {
    mapPasswordResetSessionState(state: PasswordResetSessionState): PasswordResetSessionWorkerState
    mapLoginIDFieldState(state: LoginIDFieldState): PasswordResetSessionWorkerState
}

interface Post<T> {
    (state: T): void
}
