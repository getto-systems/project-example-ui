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
    hook(stateChanged: Publisher<PasswordLoginState>): void
    onStateChange(stateChanged: Publisher<PasswordLoginState>): void
    onLoginIDFieldStateChange(stateChanged: Publisher<LoginIDFieldState>): void
    onPasswordFieldStateChange(stateChanged: Publisher<PasswordFieldState>): void
    terminate(): void
    trigger(operation: PasswordLoginComponentOperation): Promise<void>
}

export interface PasswordLoginWorkerComponentHelper {
    mapPasswordLoginState(state: PasswordLoginState): PasswordLoginWorkerState
    mapLoginIDFieldState(state: LoginIDFieldState): PasswordLoginWorkerState
    mapPasswordFieldState(state: PasswordFieldState): PasswordLoginWorkerState
}

interface Publisher<T> {
    (state: T): void
}
