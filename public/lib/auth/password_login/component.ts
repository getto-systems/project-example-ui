import { PasswordLoginState, PasswordLoginComponentOperation, PasswordLoginWorkerState } from "./data"

import { LoginIDFieldState } from "../field/login_id/data"
import { PasswordFieldState } from "../field/password/data"

import { PasswordLoginAction } from "../../password_login/action"
import { LoginIDFieldAction } from "../../field/login_id/action"
import { PasswordFieldAction } from "../../field/password/action"

export interface PasswordLoginComponentAction {
    passwordLogin: PasswordLoginAction
    loginIDField: LoginIDFieldAction
    passwordField: PasswordFieldAction
}

export interface PasswordLoginComponent {
    hook(stateChanged: Dispatcher<PasswordLoginState>): void
    onStateChange(stateChanged: Dispatcher<PasswordLoginState>): void
    onLoginIDFieldStateChange(stateChanged: Dispatcher<LoginIDFieldState>): void
    onPasswordFieldStateChange(stateChanged: Dispatcher<PasswordFieldState>): void
    terminate(): void
    trigger(operation: PasswordLoginComponentOperation): Promise<void>
}

export interface PasswordLoginWorkerComponentHelper {
    mapPasswordLoginState(state: PasswordLoginState): PasswordLoginWorkerState
    mapLoginIDFieldState(state: LoginIDFieldState): PasswordLoginWorkerState
    mapPasswordFieldState(state: PasswordFieldState): PasswordLoginWorkerState
}

interface Dispatcher<T> {
    (state: T): void
}
