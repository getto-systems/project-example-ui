import { LoginIDFieldComponentState } from "../field/login_id/data"
import { PasswordFieldComponentState } from "../field/password/data"

import { PasswordLoginAction } from "../../password_login/action"
import { LoginIDFieldAction } from "../../field/login_id/action"
import { PasswordFieldAction } from "../../field/password/action"

import { AuthCredential } from "../../credential/data"
import { InputContent, LoginError } from "../../password_login/data"
import { LoginIDFieldOperation } from "../../field/login_id/data"
import { PasswordFieldOperation } from "../../field/password/data"

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

export type PasswordLoginComponentState =
    Readonly<{ type: "initial-login" }> |
    Readonly<{ type: "try-to-login" }> |
    Readonly<{ type: "delayed-to-login" }> |
    Readonly<{ type: "failed-to-login", content: InputContent, err: LoginError }> |
    Readonly<{ type: "succeed-to-login", authCredential: AuthCredential }>

export const initialPasswordLoginComponentState: PasswordLoginComponentState = { type: "initial-login" }

export type PasswordLoginComponentOperation =
    Readonly<{ type: "login" }> |
    Readonly<{ type: "field-login_id", operation: LoginIDFieldOperation }> |
    Readonly<{ type: "field-password", operation: PasswordFieldOperation }>

export interface PasswordLoginWorkerComponentHelper {
    mapPasswordLoginComponentState(state: PasswordLoginComponentState): PasswordLoginWorkerComponentState
    mapLoginIDFieldComponentState(state: LoginIDFieldComponentState): PasswordLoginWorkerComponentState
    mapPasswordFieldComponentState(state: PasswordFieldComponentState): PasswordLoginWorkerComponentState
}

export type PasswordLoginWorkerComponentState =
    Readonly<{ type: "password_login", state: PasswordLoginComponentState }> |
    Readonly<{ type: "field-login_id", state: LoginIDFieldComponentState }> |
    Readonly<{ type: "field-password", state: PasswordFieldComponentState }>

interface Publisher<T> {
    (state: T): void
}
