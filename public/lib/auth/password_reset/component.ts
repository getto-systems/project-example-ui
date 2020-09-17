import { PasswordResetComponentState, PasswordResetComponentOperation, PasswordResetWorkerComponentState } from "./data"

import { LoginIDFieldComponentState } from "../field/login_id/data"
import { PasswordFieldComponentState } from "../field/password/data"

import { PasswordResetAction } from "../../password_reset/action"
import { LoginIDFieldAction } from "../../field/login_id/action"
import { PasswordFieldAction } from "../../field/password/action"

export interface PasswordResetComponentAction {
    passwordReset: PasswordResetAction
    loginIDField: LoginIDFieldAction
    passwordField: PasswordFieldAction
}

export interface PasswordResetComponent {
    hook(stateChanged: Publisher<PasswordResetComponentState>): void
    init(stateChanged: Publisher<PasswordResetComponentState>): void
    initLoginIDField(stateChanged: Publisher<LoginIDFieldComponentState>): void
    initPasswordField(stateChanged: Publisher<PasswordFieldComponentState>): void
    terminate(): void
    trigger(operation: PasswordResetComponentOperation): Promise<void>
}

export interface PasswordResetWorkerComponentHelper {
    mapPasswordResetComponentState(state: PasswordResetComponentState): PasswordResetWorkerComponentState
    mapLoginIDFieldComponentState(state: LoginIDFieldComponentState): PasswordResetWorkerComponentState
    mapPasswordFieldComponentState(state: PasswordFieldComponentState): PasswordResetWorkerComponentState
}

interface Publisher<T> {
    (state: T): void
}
