import { LoginIDFieldComponentState } from "../field/login_id/data"
import { PasswordFieldComponentState } from "../field/password/data"

import { PasswordResetAction } from "../../password_reset/action"
import { LoginIDFieldAction } from "../../field/login_id/action"
import { PasswordFieldAction } from "../../field/password/action"

import { AuthCredential } from "../../credential/data"
import { ResetInputContent, ResetToken, ResetError } from "../../password_reset/data"
import { LoginIDFieldOperation } from "../../field/login_id/data"
import { PasswordFieldOperation } from "../../field/password/data"

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

export type PasswordResetComponentState =
    Readonly<{ type: "initial-reset" }> |
    Readonly<{ type: "try-to-reset" }> |
    Readonly<{ type: "delayed-to-reset" }> |
    Readonly<{ type: "failed-to-reset", content: ResetInputContent, err: ResetError }> |
    Readonly<{ type: "succeed-to-reset", authCredential: AuthCredential }>

export const initialPasswordResetComponentState: PasswordResetComponentState = { type: "initial-reset" }

export type PasswordResetComponentOperation =
    Readonly<{ type: "reset", resetToken: ResetToken }> |
    Readonly<{ type: "field-login_id", operation: LoginIDFieldOperation }> |
    Readonly<{ type: "field-password", operation: PasswordFieldOperation }>

export interface PasswordResetWorkerComponentHelper {
    mapPasswordResetComponentState(state: PasswordResetComponentState): PasswordResetWorkerComponentState
    mapLoginIDFieldComponentState(state: LoginIDFieldComponentState): PasswordResetWorkerComponentState
    mapPasswordFieldComponentState(state: PasswordFieldComponentState): PasswordResetWorkerComponentState
}

export type PasswordResetWorkerComponentState =
    Readonly<{ type: "password_reset", state: PasswordResetComponentState }> |
    Readonly<{ type: "field-login_id", state: LoginIDFieldComponentState }> |
    Readonly<{ type: "field-password", state: PasswordFieldComponentState }>

interface Publisher<T> {
    (state: T): void
}
