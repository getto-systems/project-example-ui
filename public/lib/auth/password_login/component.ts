import { LoginIDFieldComponentState } from "../field/login_id/data"
import { PasswordFieldComponentState } from "../field/password/data"

import { PasswordLoginAction } from "../../password_login/action"
import { LoginIDFieldAction } from "../../field/login_id/action"
import { PasswordFieldAction } from "../../field/password/action"

import { PasswordLoginComponentState, PasswordLoginComponentOperation, PasswordLoginWorkerComponentState } from "./data"

export interface PasswordLoginComponentAction {
    passwordLogin: PasswordLoginAction
    loginIDField: LoginIDFieldAction
    passwordField: PasswordFieldAction
}

export interface PasswordLoginComponent {
    hook(stateChanged: Publisher<PasswordLoginComponentState>): void
    init(stateChanged: Publisher<PasswordLoginComponentState>): void
    initLoginIDField(stateChanged: Publisher<LoginIDFieldComponentState>): void
    initPasswordField(stateChanged: Publisher<PasswordFieldComponentState>): void
    terminate(): void
    trigger(operation: PasswordLoginComponentOperation): Promise<void>
}

export interface PasswordLoginWorkerComponentHelper {
    mapPasswordLoginComponentState(state: PasswordLoginComponentState): PasswordLoginWorkerComponentState
    mapLoginIDFieldComponentState(state: LoginIDFieldComponentState): PasswordLoginWorkerComponentState
    mapPasswordFieldComponentState(state: PasswordFieldComponentState): PasswordLoginWorkerComponentState
}

interface Publisher<T> {
    (state: T): void
}
