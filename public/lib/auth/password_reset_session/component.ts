import { LoginIDFieldComponentState } from "../field/login_id/data"

import { PasswordResetAction } from "../../password_reset/action"
import { LoginIDFieldAction } from "../../field/login_id/action"

import {
    PasswordResetSessionComponentState,
    PasswordResetSessionComponentOperation,
    PasswordResetSessionWorkerComponentState,
} from "./data"

export interface PasswordResetSessionComponentAction {
    passwordReset: PasswordResetAction
    loginIDField: LoginIDFieldAction
}

export interface PasswordResetSessionComponent {
    init(stateChanged: Publisher<PasswordResetSessionComponentState>): void
    initLoginIDField(stateChanged: Publisher<LoginIDFieldComponentState>): void
    terminate(): void
    trigger(operation: PasswordResetSessionComponentOperation): Promise<void>
}

export interface PasswordResetSessionWorkerComponentHelper {
    mapPasswordResetSessionComponentState(state: PasswordResetSessionComponentState): PasswordResetSessionWorkerComponentState
    mapLoginIDFieldComponentState(state: LoginIDFieldComponentState): PasswordResetSessionWorkerComponentState
}

interface Publisher<T> {
    (state: T): void
}
