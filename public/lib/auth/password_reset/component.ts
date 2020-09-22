import { PasswordResetState, PasswordResetComponentOperation, PasswordResetWorkerState } from "./data"

import { LoginIDFieldState } from "../field/login_id/data"
import { PasswordFieldState } from "../field/password/data"

import { PasswordResetAction } from "../../password_reset/action"
import { LoginIDFieldAction } from "../../field/login_id/action"
import { PasswordFieldAction } from "../../field/password/action"

export interface PasswordResetComponentAction {
    passwordReset: PasswordResetAction
    loginIDField: LoginIDFieldAction
    passwordField: PasswordFieldAction
}

export interface PasswordResetComponent {
    hook(stateChanged: Publisher<PasswordResetState>): void
    onStateChange(stateChanged: Publisher<PasswordResetState>): void
    onLoginIDFieldStateChange(stateChanged: Publisher<LoginIDFieldState>): void
    onPasswordFieldStateChange(stateChanged: Publisher<PasswordFieldState>): void
    terminate(): void
    trigger(operation: PasswordResetComponentOperation): Promise<void>
}

export interface PasswordResetWorkerComponentHelper {
    mapPasswordResetState(state: PasswordResetState): PasswordResetWorkerState
    mapLoginIDFieldState(state: LoginIDFieldState): PasswordResetWorkerState
    mapPasswordFieldState(state: PasswordFieldState): PasswordResetWorkerState
}

interface Publisher<T> {
    (state: T): void
}
