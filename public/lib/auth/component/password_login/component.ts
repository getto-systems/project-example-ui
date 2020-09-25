import { LoginIDFieldState } from "../field/login_id/component"
import { PasswordFieldState } from "../field/password/component"

import { PasswordLoginAction } from "../../../password_login/action"
import { LoginIDFieldAction } from "../../../field/login_id/action"
import { PasswordFieldAction } from "../../../field/password/action"

import { AuthCredential } from "../../../credential/data"
import { LoginError } from "../../../password_login/data"
import { LoginIDFieldOperation } from "../../../field/login_id/data"
import { PasswordFieldOperation } from "../../../field/password/data"

export interface PasswordLoginComponent {
    onStateChange(stateChanged: Post<PasswordLoginState>): void
    onLoginIDFieldStateChange(stateChanged: Post<LoginIDFieldState>): void
    onPasswordFieldStateChange(stateChanged: Post<PasswordFieldState>): void
    init(): Terminate
    trigger(operation: PasswordLoginComponentOperation): Promise<void>
}

export type PasswordLoginState =
    Readonly<{ type: "initial-login" }> |
    Readonly<{ type: "try-to-login" }> |
    Readonly<{ type: "delayed-to-login" }> |
    Readonly<{ type: "failed-to-login", err: LoginError }> |
    Readonly<{ type: "succeed-to-login", authCredential: AuthCredential }>

export const initialPasswordLoginState: PasswordLoginState = { type: "initial-login" }

export type PasswordLoginComponentOperation =
    Readonly<{ type: "login" }> |
    Readonly<{ type: "field-login_id", operation: LoginIDFieldOperation }> |
    Readonly<{ type: "field-password", operation: PasswordFieldOperation }>

export interface PasswordLoginWorkerComponentHelper {
    mapPasswordLoginState(state: PasswordLoginState): PasswordLoginWorkerState
    mapLoginIDFieldState(state: LoginIDFieldState): PasswordLoginWorkerState
    mapPasswordFieldState(state: PasswordFieldState): PasswordLoginWorkerState
}

export type PasswordLoginWorkerState =
    Readonly<{ type: "password_login", state: PasswordLoginState }> |
    Readonly<{ type: "field-login_id", state: LoginIDFieldState }> |
    Readonly<{ type: "field-password", state: PasswordFieldState }>

export interface PasswordLoginComponentAction {
    passwordLogin: PasswordLoginAction
    loginIDField: LoginIDFieldAction
    passwordField: PasswordFieldAction
}

interface Post<T> {
    (state: T): void
}

interface Terminate {
    (): void
}
