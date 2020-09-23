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
    hook(stateChanged: Dispatcher<PasswordResetState>): void
    onStateChange(stateChanged: Dispatcher<PasswordResetState>): void
    onLoginIDFieldStateChange(stateChanged: Dispatcher<LoginIDFieldState>): void
    onPasswordFieldStateChange(stateChanged: Dispatcher<PasswordFieldState>): void
    terminate(): void
    trigger(operation: PasswordResetComponentOperation): Promise<void>
}

export interface PasswordResetWorkerComponentHelper {
    mapPasswordResetState(state: PasswordResetState): PasswordResetWorkerState
    mapLoginIDFieldState(state: LoginIDFieldState): PasswordResetWorkerState
    mapPasswordFieldState(state: PasswordFieldState): PasswordResetWorkerState
}

interface Dispatcher<T> {
    (state: T): void
}
